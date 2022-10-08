/**
 * @author Niklas Higi
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

/**
 * @typedef { import('../utils').ComponentPropertyData } ComponentPropertyData
 */

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * @param {RuleContext} context
 */
function parseOptions(context) {
  /** @type {Set<'always' | 'never' | 'function'>} */
  const allows = new Set()
  if (Array.isArray(context.options[0])) {
    for (const o of context.options[0]) allows.add(o)
  } else {
    allows.add(context.options[0] || 'never')
  }

  const option = context.options[1] || {}
  const ignoreIncludesComment = !!option.ignoreIncludesComment

  return { allows, ignoreIncludesComment }
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
 * Returns a call expression node if the given VOnExpression or BlockStatement consists
 * of only a single identifier call expression.
 * e.g.
 *   @click="foo()"
 *   @click="{ foo() }"
 *   @click="foo();;"
 * @param {VOnExpression | BlockStatement} node
 * @returns {CallExpression | null}
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
  if (expression.type !== 'CallExpression' || expression.arguments.length > 0) {
    return null
  }
  if (expression.optional) {
    // Allow optional chaining
    return null
  }
  const callee = expression.callee
  if (callee.type !== 'Identifier') {
    return null
  }
  return expression
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce or forbid parentheses after method calls without arguments in `v-on` directives',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/v-on-function-call.html'
    },
    fixable: 'code',
    schema: [
      {
        oneOf: [
          { enum: ['always', 'never', 'function'] },
          { type: 'array', items: { enum: ['always', 'never', 'function'] } }
        ]
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
    ]
  },
  /** @param {RuleContext} context */
  create(context) {
    const { allows, ignoreIncludesComment } = parseOptions(context)

    /** @type {Set<string>} */
    const useArgsMethods = new Set()
    /** @type {Identifier[]} */
    const $eventIdentifiers = []

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
      /** @type {Range} */
      const range = isQuote(firstToken)
        ? [firstToken.range[1], lastToken.range[0]]
        : [firstToken.range[0], lastToken.range[1]]

      const hasComment = tokens.some(
        (token) => token.type === 'Block' || token.type === 'Line'
      )

      return {
        innerRange: range,
        hasComment
      }
    }
    /**
     * Check if `v-on:click="foo()"` can be converted to `v-on:click="foo"` and report if it can.
     * @param {VOnExpression} node
     */
    function verifyForVOnExpressionToIdentifier(node) {
      const expression = getIdentifierCallExpression(node)
      if (!expression) {
        return false
      }

      const { innerRange, hasComment } = getVExpressionContainerTokenInfo(
        node.parent
      )

      if (ignoreIncludesComment && hasComment) {
        return false
      }

      if (
        expression.callee.type === 'Identifier' &&
        useArgsMethods.has(expression.callee.name)
      ) {
        // The behavior of target method can change given the arguments.
        return false
      }

      context.report({
        node: expression,
        message:
          "Method calls without arguments inside of 'v-on' directives must not have parentheses.",
        fix: hasComment
          ? null /* The comment is included and cannot be fixed. */
          : (fixer) =>
              fixer.replaceTextRange(
                innerRange,
                context.getSourceCode().getText(expression.callee)
              )
      })
      return true
    }
    /**
     * Reports that `v-on:click="foo()"` can be converted to `v-on:click="()=>foo()"`.
     * @param {VOnExpression} node
     */
    function reportVOnExpressionToFunction(node) {
      const has$Event = $eventIdentifiers.some(
        ({ range }) => node.range[0] <= range[0] && range[1] <= node.range[1]
      )

      context.report({
        node,
        message:
          "Statements inside of 'v-on' directives must use function instead.",
        fix: has$Event
          ? null /* The $event is included and cannot be fixed. */
          : function* (fixer) {
              yield fixer.insertTextBefore(node, '() => ')
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
      })
    }

    /**
     * Check if `v-on:click="() => foo()"` can be converted to `v-on:click="foo"` and report if it can.
     * @param {ArrowFunctionExpression | FunctionExpression} node
     */
    function verifyForFunctionToIdentifier(node) {
      /** @type {CallExpression} */
      let expression
      if (node.body.type === 'BlockStatement') {
        const callExpression = getIdentifierCallExpression(node.body)
        if (!callExpression) {
          return false
        }
        expression = callExpression
      } else {
        if (
          node.body.type !== 'CallExpression' ||
          node.body.arguments.length > 0 ||
          node.body.callee.type !== 'Identifier'
        ) {
          return false
        }
        expression = node.body
      }

      const { innerRange, hasComment } = getVExpressionContainerTokenInfo(
        /** @type {VExpressionContainer} */ (node.parent)
      )

      if (ignoreIncludesComment && hasComment) {
        return false
      }

      if (
        expression.callee.type === 'Identifier' &&
        useArgsMethods.has(expression.callee.name)
      ) {
        // The behavior of target method can change given the arguments.
        return false
      }

      context.report({
        node: expression,
        message:
          "Function that only call identifier in 'v-on' directives must use identifier instead.",
        fix: hasComment
          ? null /* The comment is included and cannot be fixed. */
          : (fixer) =>
              fixer.replaceTextRange(
                innerRange,
                context.getSourceCode().getText(expression.callee)
              )
      })
      return true
    }
    /**
     * Check if `v-on:click="() => foo()"` can be converted to `v-on:click="foo()"` and report if it can.
     * @param {ArrowFunctionExpression | FunctionExpression} node
     */
    function verifyForFunctionToVOnExpression(node) {
      if (node.params.length > 1) {
        return false
      }

      context.report({
        node,
        message:
          "Function in 'v-on' directives must define statements directly instead.",
        fix:
          node.params.length > 0
            ? null /* Have parameters and cannot be fixed. */
            : (fixer) =>
                node.body.type !== 'BlockStatement'
                  ? fixer.removeRange([node.range[0], node.body.range[0]])
                  : [
                      fixer.removeRange([
                        node.range[0],
                        node.body.body[0].range[0]
                      ]),
                      fixer.removeRange([
                        node.body.body[node.body.body.length - 1].range[1],
                        node.range[1]
                      ])
                    ]
      })
      return true
    }

    return utils.defineTemplateBodyVisitor(
      context,
      {
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
              if (allows.has('always')) {
                return
              }
              for (const allow of allows) {
                if (allow === 'never') {
                  if (verifyForVOnExpressionToIdentifier(expression)) {
                    return
                  }
                } else if (allow === 'function') {
                  reportVOnExpressionToFunction(expression)
                  return
                }
              }

              break
            }
            case 'Identifier': {
              // e.g. v-on:click="foo"
              if (allows.has('never')) {
                return
              }
              context.report({
                node,
                message:
                  "Method calls inside of 'v-on' directives must have parentheses."
              })

              break
            }
            case 'ArrowFunctionExpression':
            case 'FunctionExpression': {
              // e.g. v-on:click="()=>foo()"
              if (allows.has('function')) {
                return
              }
              for (const allow of allows) {
                let reported = false
                if (allow === 'never') {
                  reported = verifyForFunctionToIdentifier(expression)
                } else if (allow === 'always') {
                  reported = verifyForFunctionToVOnExpression(expression)
                }
                if (reported) {
                  return
                }
              }

              break
            }
            // No default
          }
        },
        ...(!allows.has('always') && allows.has('function')
          ? // Collect $event identifiers to check for side effects
            // when converting from `v-on:click="foo($event)"` to `v-on:click="()=>foo($event)"` .
            {
              'Identifier[name="$event"]'(node) {
                $eventIdentifiers.push(node)
              }
            }
          : {})
      },
      allows.has('never')
        ? // Collect method definition information with arguments to check for side effects
          // when converting from `v-on:click="foo()"` to `v-on:click="foo"`, or
          // converting from `v-on:click="() => foo()"` to `v-on:click="foo"`.
          utils.defineVueVisitor(context, {
            onVueObjectEnter(node) {
              for (const method of utils.iterateProperties(
                node,
                new Set(['methods'])
              )) {
                if (useArgsMethods.has(method.name)) {
                  continue
                }
                if (method.type !== 'object') {
                  continue
                }
                const value = method.property.value
                if (
                  (value.type === 'FunctionExpression' ||
                    value.type === 'ArrowFunctionExpression') &&
                  value.params.length > 0
                ) {
                  useArgsMethods.add(method.name)
                }
              }
            }
          })
        : {}
    )
  }
}
