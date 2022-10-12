/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

/**
 * @typedef {import('eslint').ReportDescriptorFix} ReportDescriptorFix
 * @typedef {'method' | 'inline' | 'inline-function'} HandlerKind
 * @typedef {HandlerKind[]} HandlerKinds
 * @typedef {object} ObjectOption
 * @property {boolean} [ignoreIncludesComment]
 */

/**
 * @param {RuleContext} context
 */
function parseOptions(context) {
  /** @type {[HandlerKinds | undefined, ObjectOption | undefined]} */
  const options = /** @type {any} */ (context.options)
  /** @type {Set<HandlerKind>} */
  const allows = new Set()
  if (options[0]) {
    for (const o of options[0]) allows.add(o)
  } else {
    allows.add('method')
    allows.add('inline-function')
  }

  const option = options[1] || {}
  const ignoreIncludesComment = !!option.ignoreIncludesComment

  return { allows: [...allows], ignoreIncludesComment }
}

/**
 * @param {Iterable<HandlerKind>} allows
 */
function getHandlerKindsPhrase(allows) {
  /** @type {Record<HandlerKind, string>} */
  const map = {
    method: 'method handler',
    inline: 'inline handler',
    'inline-function': 'inline function'
  }

  const allowsPhrase = [...allows].map((s) => map[s])
  switch (allowsPhrase.length) {
    case 1:
      return allowsPhrase[0]
    default:
      return `${allowsPhrase.slice(0, -1).join(', ')}, or ${
        allowsPhrase[allowsPhrase.length - 1]
      }`
  }
}

/**
 * Check whether the given token is a quote.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a quote.
 */
function isQuote(token) {
  return (
    token != null &&
    token.type === 'Punctuator' &&
    (token.value === '"' || token.value === "'")
  )
}
/**
 * Check whether the given node is an identifier call expression. e.g. `foo()`
 * @param {Expression} node The node to check.
 * @returns {node is CallExpression & {callee: Identifier}}
 */
function isIdentifierCallExpression(node) {
  if (node.type !== 'CallExpression') {
    return false
  }
  if (node.optional) {
    // optional chaining
    return false
  }
  const callee = node.callee
  return callee.type === 'Identifier'
}

/**
 * Returns a call expression node if the given VOnExpression or BlockStatement consists
 * of only a single identifier call expression.
 * e.g.
 *   @click="foo()"
 *   @click="{ foo() }"
 *   @click="foo();;"
 * @param {VOnExpression | BlockStatement} node
 * @returns {CallExpression & {callee: Identifier} | null}
 */
function getIdentifierCallExpression(node) {
  /** @type {ExpressionStatement} */
  let exprStatement
  let body = node.body
  while (true) {
    const statements = body.filter((st) => st.type !== 'EmptyStatement')
    if (statements.length !== 1) {
      return null
    }
    const statement = statements[0]
    if (statement.type === 'ExpressionStatement') {
      exprStatement = statement
      break
    }
    if (statement.type === 'BlockStatement') {
      body = statement.body
      continue
    }
    return null
  }
  const expression = exprStatement.expression
  if (!isIdentifierCallExpression(expression)) {
    return null
  }
  return expression
}

module.exports = {
  meta: {
    hasSuggestions: true,
    type: 'suggestion',
    docs: {
      description: 'enforce writing style for handlers in `v-on` directives',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/v-on-handler-style.html'
    },
    fixable: 'code',
    schema: [
      {
        type: 'array',
        items: { enum: ['method', 'inline', 'inline-function'] },
        uniqueItems: true,
        additionalItems: false,
        minItems: 1,
        maxItems: 2
      },
      {
        type: 'object',
        properties: {
          ignoreIncludesComment: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      preferXOverInline: 'Prefer {{allows}} over inline handler in v-on.',
      preferXOverInlineFunction:
        'Prefer {{allows}} over inline function in v-on.',
      disallowMethodHandler: 'Method handlers are not allowed. Use {{allows}}.',
      useMethodInsteadOfInline: 'Use method handler instead of inline handler.',
      useInlineFunctionInsteadOfInline:
        'Use inline function instead of inline handler.',
      useMethodInsteadOfInlineFunction:
        'Use method handler instead of inline function.',
      useInlineInsteadOfInlineFunction:
        'Use inline handler instead of inline function.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const { allows, ignoreIncludesComment } = parseOptions(context)

    /** @type {Set<VElement>} */
    const upperElements = new Set()
    /** @type {Map<string, number>} */
    const methodParamCountMap = new Map()
    /** @type {Identifier[]} */
    const $eventIdentifiers = []

    /**
     * @typedef {object} ReportResult
     * @property {ReportDescriptorFix | null} fix
     * @property {string} suggestMessageId
     * @property {HandlerKind} kind
     */

    const VERIFY_INLINE_HANDLERS = {
      method: verifyInlineHandlerCanBeReplacedWithMethodHandler,
      'inline-function':
        verifyInlineHandlerCanBeReplacedWithInlineFunctionHandler,
      inline: () => null
    }
    const VERIFY_INLINE_FUNCTION_HANDLERS = {
      method: verifyInlineFunctionHandlerCanBeReplacedWithMethodHandler,
      inline: verifyInlineFunctionHandlerCanBeReplacedWithInlineHandler,
      'inline-function': () => null
    }

    /**
     * Get token information for the given VExpressionContainer node.
     * @param {VExpressionContainer} node
     */
    function getVExpressionContainerTokenInfo(node) {
      const tokenStore = context.parserServices.getTemplateBodyTokenStore()
      const tokens = tokenStore.getTokens(node, {
        includeComments: true
      })
      const firstToken = tokens[0]
      const lastToken = tokens[tokens.length - 1]

      const hasQuote = isQuote(firstToken)
      /**
       * Range without quotes.
       * @type {Range}
       */
      const range = hasQuote
        ? [firstToken.range[1], lastToken.range[0]]
        : [firstToken.range[0], lastToken.range[1]]

      return {
        innerRange: range,
        get hasComment() {
          return tokens.some(
            (token) => token.type === 'Block' || token.type === 'Line'
          )
        },
        hasQuote
      }
    }

    /**
     * Checks whether the given node refers to a variable of the element.
     * @param {Expression | VOnExpression} node
     */
    function hasReferenceUpperElementVariable(node) {
      for (const element of upperElements) {
        for (const vv of element.variables) {
          for (const reference of vv.references) {
            const { range } = reference.id
            if (node.range[0] <= range[0] && range[1] <= node.range[1]) {
              return true
            }
          }
        }
      }
      return false
    }
    /**
     * Check if `v-on:click="foo()"` can be converted to `v-on:click="foo"` and report if it can.
     * @param {VOnExpression} node
     * @returns {ReportResult & { kind: 'method' } | null}
     */
    function verifyInlineHandlerCanBeReplacedWithMethodHandler(node) {
      const { innerRange, hasComment } = getVExpressionContainerTokenInfo(
        node.parent
      )
      if (ignoreIncludesComment && hasComment) {
        return null
      }

      const idCallExpr = getIdentifierCallExpression(node)
      if (
        (!idCallExpr || idCallExpr.arguments.length > 0) &&
        hasReferenceUpperElementVariable(node)
      ) {
        // It cannot be converted to method because it refers to the variable of the element.
        // e.g. <template v-for="e in list"><button @click="foo(e)" /></template>
        return null
      }

      return {
        kind: 'method',
        suggestMessageId: 'useMethodInsteadOfInline',
        fix: buildFixer(idCallExpr)
      }

      /**
       * @param {CallExpression & {callee: Identifier} | null} expression
       * @returns {ReportDescriptorFix | null}
       */
      function buildFixer(expression) {
        if (
          hasComment /* The statement contains comment and cannot be fixed. */ ||
          !expression /* The statement is not a simple identifier call and cannot be fixed. */ ||
          expression.arguments.length > 0
        ) {
          return null
        }
        const paramCount = methodParamCountMap.get(expression.callee.name)
        if (paramCount != null && paramCount > 0) {
          // The behavior of target method can change given the arguments.
          return null
        }
        return (fixer) =>
          fixer.replaceTextRange(
            innerRange,
            context.getSourceCode().getText(expression.callee)
          )
      }
    }
    /**
     * Check if `v-on:click="foo()"` can be converted to `v-on:click="()=>foo()"` and report if it can.
     * @param {VOnExpression} node
     * @returns {ReportResult & { kind: 'inline-function' } | null}
     */
    function verifyInlineHandlerCanBeReplacedWithInlineFunctionHandler(node) {
      const has$Event = $eventIdentifiers.some(
        ({ range }) => node.range[0] <= range[0] && range[1] <= node.range[1]
      )

      const { innerRange, hasQuote } = getVExpressionContainerTokenInfo(
        node.parent
      )
      return {
        kind: 'inline-function',
        suggestMessageId: 'useInlineFunctionInsteadOfInline',
        fix:
          has$Event /* The statements contains $event and cannot be fixed. */ ||
          !hasQuote /* The statements is not enclosed in quotes and cannot be fixed. */
            ? null
            : function* (fixer) {
                yield fixer.insertTextBeforeRange(innerRange, '() => ')
                const tokenStore =
                  context.parserServices.getTemplateBodyTokenStore()
                const firstToken = tokenStore.getFirstToken(node)
                const lastToken = tokenStore.getLastToken(node)
                if (firstToken.value === '{' && lastToken.value === '}') return
                if (
                  lastToken.value !== ';' &&
                  node.body.length === 1 &&
                  node.body[0].type === 'ExpressionStatement'
                ) {
                  // it is a single expression
                  return
                }
                yield fixer.insertTextBefore(firstToken, '{')
                yield fixer.insertTextAfter(lastToken, '}')
              }
      }
    }

    /**
     * Check if `v-on:click="() => foo()"` can be converted to `v-on:click="foo"` and report if it can.
     * @param {ArrowFunctionExpression | FunctionExpression} node
     * @returns {ReportResult & { kind: 'method' } | null}
     */
    function verifyInlineFunctionHandlerCanBeReplacedWithMethodHandler(node) {
      const { innerRange, hasComment } = getVExpressionContainerTokenInfo(
        /** @type {VExpressionContainer} */ (node.parent)
      )
      if (ignoreIncludesComment && hasComment) {
        return null
      }

      /** @type {CallExpression & {callee: Identifier} | null} */
      let idCallExpr = null
      if (node.body.type === 'BlockStatement') {
        idCallExpr = getIdentifierCallExpression(node.body)
      } else if (isIdentifierCallExpression(node.body)) {
        idCallExpr = node.body
      }
      if (
        (!idCallExpr || !isSameParamsAndArgs(idCallExpr)) &&
        hasReferenceUpperElementVariable(node)
      ) {
        // It cannot be converted to method because it refers to the variable of the element.
        // e.g. <template v-for="e in list"><button @click="() => foo(e)" /></template>
        return null
      }

      return {
        kind: 'method',
        suggestMessageId: 'useMethodInsteadOfInlineFunction',
        fix: buildFixer(idCallExpr)
      }

      /**
       * Checks whether parameters are passed as arguments as-is.
       * @param {CallExpression} expression
       */
      function isSameParamsAndArgs(expression) {
        return (
          node.params.length === expression.arguments.length &&
          node.params.every((param, index) => {
            if (param.type !== 'Identifier') {
              return false
            }
            const arg = expression.arguments[index]
            if (!arg || arg.type !== 'Identifier') {
              return false
            }
            return param.name === arg.name
          })
        )
      }

      /**
       * @param {CallExpression & {callee: Identifier} | null} expression
       * @returns {ReportDescriptorFix | null}
       */
      function buildFixer(expression) {
        if (
          hasComment /* The function contains comment and cannot be fixed. */ ||
          !expression /* The function is not a simple identifier call and cannot be fixed. */
        ) {
          return null
        }
        if (!isSameParamsAndArgs(expression)) {
          // It is not a call with the arguments given as is.
          return null
        }
        const paramCount = methodParamCountMap.get(expression.callee.name)
        if (paramCount != null && paramCount !== expression.arguments.length) {
          // The behavior of target method can change given the arguments.
          return null
        }
        return (fixer) =>
          fixer.replaceTextRange(
            innerRange,
            context.getSourceCode().getText(expression.callee)
          )
      }
    }
    /**
     * Check if `v-on:click="() => foo()"` can be converted to `v-on:click="foo()"` and report if it can.
     * @param {ArrowFunctionExpression | FunctionExpression} node
     * @returns {ReportResult & { kind: 'inline' } | null}
     */
    function verifyInlineFunctionHandlerCanBeReplacedWithInlineHandler(node) {
      if (node.params.length > 1) {
        // Can't convert to inline handler if it has 2 or more parameters.
        // If there is one parameter, it can be converted to an inline handler using $event.
        return null
      }

      return {
        kind: 'inline',
        suggestMessageId: 'useInlineInsteadOfInlineFunction',
        fix:
          node.params.length > 0
            ? null /* The function has parameters and cannot be fixed. */
            : (fixer) => {
                let text = context.getSourceCode().getText(node.body)
                if (node.body.type === 'BlockStatement') {
                  text = text.slice(1, -1) // strip braces
                }
                return fixer.replaceText(node, text)
              }
      }
    }

    /**
     * @param {Expression | VOnExpression} node
     * @param {ReportResult[]} results
     * @param {string} messageId
     */
    function reportResults(node, results, messageId) {
      if (results.length > 0) {
        const fixableList = results.filter((r) => r.fix)
        context.report({
          node,
          messageId,
          data: {
            allows: getHandlerKindsPhrase(results.map((r) => r.kind))
          },
          fix: fixableList.length > 0 ? fixableList[0].fix : null,
          suggest:
            fixableList.length > 1
              ? fixableList.map((r) => ({
                  messageId: r.suggestMessageId,
                  fix: r.fix
                }))
              : []
        })
      }
    }

    return utils.defineTemplateBodyVisitor(
      context,
      {
        VElement(node) {
          upperElements.add(node)
        },
        'VElement:exit'(node) {
          upperElements.delete(node)
        },
        /** @param {VExpressionContainer} node */
        "VAttribute[directive=true][key.name.name='on'][key.argument!=null] > VExpressionContainer.value:exit"(
          node
        ) {
          const expression = node.expression
          if (!expression) {
            return
          }
          switch (expression.type) {
            case 'VOnExpression': {
              // e.g. v-on:click="foo()"
              if (allows.includes('inline')) {
                return
              }
              const results = allows
                .map((allow) => VERIFY_INLINE_HANDLERS[allow](expression))
                .filter(utils.isDef)

              reportResults(expression, results, 'preferXOverInline')

              break
            }
            case 'Identifier': {
              // e.g. v-on:click="foo"
              if (allows.includes('method')) {
                return
              }
              context.report({
                node,
                messageId: 'disallowMethodHandler',
                data: {
                  allows: getHandlerKindsPhrase(allows)
                }
              })

              break
            }
            case 'ArrowFunctionExpression':
            case 'FunctionExpression': {
              // e.g. v-on:click="()=>foo()"
              if (allows.includes('inline-function')) {
                return
              }
              const results = allows
                .map((allow) =>
                  VERIFY_INLINE_FUNCTION_HANDLERS[allow](expression)
                )
                .filter(utils.isDef)

              reportResults(expression, results, 'preferXOverInlineFunction')

              break
            }
            // No default
          }
        },
        ...(!allows.includes('inline') && allows.includes('inline-function')
          ? // Collect $event identifiers to check for side effects
            // when converting from `v-on:click="foo($event)"` to `v-on:click="()=>foo($event)"` .
            {
              'Identifier[name="$event"]'(node) {
                $eventIdentifiers.push(node)
              }
            }
          : {})
      },
      allows.includes('method')
        ? // Collect method definition with params information to check for side effects.
          // when converting from `v-on:click="foo()"` to `v-on:click="foo"`, or
          // converting from `v-on:click="() => foo()"` to `v-on:click="foo"`.
          utils.defineVueVisitor(context, {
            onVueObjectEnter(node) {
              for (const method of utils.iterateProperties(
                node,
                new Set(['methods'])
              )) {
                if (method.type !== 'object') {
                  // This branch is usually not passed.
                  continue
                }
                const value = method.property.value
                if (
                  value.type === 'FunctionExpression' ||
                  value.type === 'ArrowFunctionExpression'
                ) {
                  methodParamCountMap.set(
                    method.name,
                    value.params.some((p) => p.type === 'RestElement')
                      ? Number.POSITIVE_INFINITY
                      : value.params.length
                  )
                }
              }
            }
          })
        : {}
    )
  }
}
