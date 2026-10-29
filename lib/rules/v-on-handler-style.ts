/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'

type HandlerKind = 'method' | 'inline' | 'inline-function'
interface ObjectOption {
  ignoreIncludesComment?: boolean
}

function parseOptions(context: RuleContext) {
  const options = context.options as [
    HandlerKind | HandlerKind[] | undefined,
    ObjectOption | undefined
  ]
  const allows: HandlerKind[] = []
  if (options[0]) {
    if (Array.isArray(options[0])) {
      allows.push(...options[0])
    } else {
      allows.push(options[0])
    }
  } else {
    allows.push('method', 'inline-function')
  }

  const option = options[1] || {}
  const shouldIgnoreIncludesComment = Boolean(option.ignoreIncludesComment)

  return { allows, shouldIgnoreIncludesComment }
}

/**
 * Check whether the given token is a quote.
 */
function isQuote(token: Token): boolean {
  return (
    token != null &&
    token.type === 'Punctuator' &&
    (token.value === '"' || token.value === "'")
  )
}
/**
 * Get the number of parameters of the given function. Returns `Infinity` if it has a rest parameter.
 */
function getParamCount(
  node: FunctionDeclaration | FunctionExpression | ArrowFunctionExpression
): number {
  return node.params.some((p) => p.type === 'RestElement')
    ? Infinity
    : node.params.length
}
/**
 * Check whether the given node is an identifier call expression. e.g. `foo()`
 */
function isIdentifierCallExpression(
  node: Expression
): node is CallExpression & { callee: Identifier } {
  if (node.type !== 'CallExpression' || node.optional) {
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
 */
function getIdentifierCallExpression(
  node: VOnExpression | BlockStatement
): (CallExpression & { callee: Identifier }) | null {
  let exprStatement: ExpressionStatement
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
  return isIdentifierCallExpression(expression) ? expression : null
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce writing style for handlers in `v-on` directives',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/v-on-handler-style.html'
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [
      {
        oneOf: [
          { enum: ['inline', 'inline-function'] },
          {
            type: 'array',
            items: [
              { enum: ['method', 'inline'] },
              { enum: ['inline', 'inline-function'] }
            ],
            uniqueItems: true,
            additionalItems: false,
            minItems: 2,
            maxItems: 2
          }
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
    ],
    messages: {
      preferMethodOverInline:
        'Prefer method handler over inline handler in v-on.',
      preferMethodOverInlineWithoutIdCall:
        'Prefer method handler over inline handler in v-on. Note that you may need to create a new method.',
      preferMethodOverInlineFunction:
        'Prefer method handler over inline function in v-on.',
      preferMethodOverInlineFunctionWithoutIdCall:
        'Prefer method handler over inline function in v-on. Note that you may need to create a new method.',
      preferInlineOverMethod:
        'Prefer inline handler over method handler in v-on.',
      preferInlineOverInlineFunction:
        'Prefer inline handler over inline function in v-on.',
      preferInlineFunctionOverMethod:
        'Prefer inline function over method handler in v-on.',
      preferInlineFunctionOverInline:
        'Prefer inline function over inline handler in v-on.',
      replaceWithMethodHandler:
        'Replace with method handler. Note that the method will receive the event arguments.'
    }
  },
  create(context: RuleContext) {
    const sourceCode = context.sourceCode
    const { allows, shouldIgnoreIncludesComment } = parseOptions(context)
    // With `["inline", "inline-function"]`, inline functions with parameters
    // are used instead of inline handlers with `$event`.
    const shouldUseInlineFunctionForPayload =
      allows[0] === 'inline' && allows.includes('inline-function')

    const upperElements = new Set<VElement>()
    const methodParamCountMap = new Map<string, number>()
    const $eventIdentifiers: Identifier[] = []

    /**
     * Verify for inline handler. Returns `true` if reported.
     */
    // eslint-disable-next-line unicorn/consistent-boolean-name -- reports and returns whether it did
    function verifyForInlineHandler(
      node: VOnExpression,
      kind: HandlerKind
    ): boolean {
      switch (kind) {
        case 'method': {
          return verifyCanUseMethodHandlerForInlineHandler(node)
        }
        case 'inline-function': {
          reportCanUseInlineFunctionForInlineHandler(node)
          return true
        }
      }
      return false
    }
    /**
     * Report for method handler. Returns `true` if reported.
     */
    // eslint-disable-next-line unicorn/consistent-boolean-name -- reports and returns whether it did
    function reportForMethodHandler(
      node: Identifier,
      kind: HandlerKind
    ): boolean {
      switch (kind) {
        case 'inline':
        case 'inline-function': {
          context.report({
            node,
            messageId:
              kind === 'inline'
                ? 'preferInlineOverMethod'
                : 'preferInlineFunctionOverMethod'
          })
          return true
        }
      }
      // This path is currently not taken.
      return false
    }
    /**
     * Verify for inline function handler. Returns `true` if reported.
     */
    // eslint-disable-next-line unicorn/consistent-boolean-name -- reports and returns whether it did
    function verifyForInlineFunction(
      node: ArrowFunctionExpression | FunctionExpression,
      kind: HandlerKind
    ): boolean {
      switch (kind) {
        case 'method': {
          return verifyCanUseMethodHandlerForInlineFunction(node)
        }
        case 'inline': {
          return verifyCanUseInlineHandlerForInlineFunction(node)
        }
      }
      return false
    }

    /**
     * Get token information for the given VExpressionContainer node.
     */
    function getVExpressionContainerTokenInfo(node: VExpressionContainer) {
      const tokenStore = sourceCode.parserServices.getTemplateBodyTokenStore()
      const tokens = tokenStore.getTokens(node, {
        includeComments: true
      })
      const firstToken = tokens[0]
      const lastToken = tokens.at(-1)

      if (!lastToken) {
        const rangeWithoutQuotes: Range = [0, 0]
        return {
          rangeWithoutQuotes,
          hasComment: false,
          hasQuote: false
        }
      }

      const hasQuote = isQuote(firstToken)
      const rangeWithoutQuotes: Range = hasQuote
        ? [firstToken.range[1], lastToken.range[0]]
        : [firstToken.range[0], lastToken.range[1]]

      return {
        rangeWithoutQuotes,
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
     */
    function hasReferenceUpperElementVariable(
      node: Expression | VOnExpression
    ) {
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
     * Get the fix that replaces the handler with the called method.
     * It is an autofix only if the method is known to take as many parameters as the given arguments,
     * otherwise it is a suggestion because the method will receive the event arguments.
     */
    function getMethodHandlerFix(
      idCallExpr: CallExpression & { callee: Identifier },
      rangeWithoutQuotes: Range
    ): Pick<Rule.ReportDescriptor, 'fix' | 'suggest'> {
      const fix = (fixer: RuleFixer) =>
        fixer.replaceTextRange(
          rangeWithoutQuotes,
          sourceCode.getText(idCallExpr.callee)
        )
      const paramCount = methodParamCountMap.get(idCallExpr.callee.name)
      return paramCount === idCallExpr.arguments.length
        ? { fix }
        : // The method is unknown, or its behavior can change given the arguments.
          { suggest: [{ messageId: 'replaceWithMethodHandler', fix }] }
    }
    /**
     * Check if `v-on:click="foo()"` can be converted to `v-on:click="foo"` and report if it can.
     * Returns `true` if reported.
     */
    // eslint-disable-next-line unicorn/consistent-boolean-name -- reports and returns whether it did
    function verifyCanUseMethodHandlerForInlineHandler(
      node: VOnExpression
    ): boolean {
      const { rangeWithoutQuotes, hasComment } =
        getVExpressionContainerTokenInfo(node.parent)
      if (shouldIgnoreIncludesComment && hasComment) {
        return false
      }

      const idCallExpr = getIdentifierCallExpression(node)
      if (
        (!idCallExpr || idCallExpr.arguments.length > 0) &&
        hasReferenceUpperElementVariable(node)
      ) {
        // It cannot be converted to method because it refers to the variable of the element.
        // e.g. <template v-for="e in list"><button @click="foo(e)" /></template>
        return false
      }

      context.report({
        node,
        messageId: idCallExpr
          ? 'preferMethodOverInline'
          : 'preferMethodOverInlineWithoutIdCall',
        ...(hasComment /* The statement contains comment and cannot be fixed. */ ||
        !idCallExpr /* The statement is not a simple identifier call and cannot be fixed. */ ||
        idCallExpr.arguments.length > 0
          ? null
          : getMethodHandlerFix(idCallExpr, rangeWithoutQuotes))
      })
      return true
    }
    /**
     * Check if `v-on:click="() => foo()"` can be converted to `v-on:click="foo"` and report if it can.
     * Returns `true` if reported.
     */
    // eslint-disable-next-line unicorn/consistent-boolean-name -- reports and returns whether it did
    function verifyCanUseMethodHandlerForInlineFunction(
      node: ArrowFunctionExpression | FunctionExpression
    ): boolean {
      const { rangeWithoutQuotes, hasComment } =
        getVExpressionContainerTokenInfo(node.parent as VExpressionContainer)
      if (shouldIgnoreIncludesComment && hasComment) {
        return false
      }

      let idCallExpr: (CallExpression & { callee: Identifier }) | null = null
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
        return false
      }

      context.report({
        node,
        messageId: idCallExpr
          ? 'preferMethodOverInlineFunction'
          : 'preferMethodOverInlineFunctionWithoutIdCall',
        ...(hasComment /* The function contains comment and cannot be fixed. */ ||
        !idCallExpr /* The function is not a simple identifier call and cannot be fixed. */ ||
        !isSameParamsAndArgs(
          idCallExpr
        ) /* It is not a call with the arguments given as is. */
          ? null
          : getMethodHandlerFix(idCallExpr, rangeWithoutQuotes))
      })
      return true

      /**
       * Checks whether parameters are passed as arguments as-is.
       */
      function isSameParamsAndArgs(expression: CallExpression) {
        return (
          node.params.length === expression.arguments.length &&
          node.params.every((param, index) => {
            if (param.type !== 'Identifier') {
              return false
            }
            const arg = expression.arguments[index]
            return (
              Boolean(arg) &&
              arg.type === 'Identifier' &&
              param.name === arg.name
            )
          })
        )
      }
    }
    /**
     * Checks whether the given inline handler uses `$event`.
     */
    function hasEventIdentifier(node: VOnExpression): boolean {
      return $eventIdentifiers.some(
        ({ range }) => node.range[0] <= range[0] && range[1] <= node.range[1]
      )
    }
    /**
     * Report `v-on:click="foo()"` can be converted to `v-on:click="()=>foo()"`.
     */
    function reportCanUseInlineFunctionForInlineHandler(
      node: VOnExpression
    ): void {
      context.report({
        node,
        messageId: 'preferInlineFunctionOverInline',
        *fix(fixer) {
          if (hasEventIdentifier(node)) {
            /* The statements contains $event and cannot be fixed. */
            return
          }
          const { rangeWithoutQuotes, hasQuote } =
            getVExpressionContainerTokenInfo(node.parent)
          if (!hasQuote) {
            /* The statements is not enclosed in quotes and cannot be fixed. */
            return
          }
          yield fixer.insertTextBeforeRange(rangeWithoutQuotes, '() => ')
          const tokenStore =
            sourceCode.parserServices.getTemplateBodyTokenStore()
          const firstToken = tokenStore.getFirstToken(node)
          const lastToken = tokenStore.getLastToken(node)
          if (
            (firstToken.value === '{' && lastToken.value === '}') ||
            (lastToken.value !== ';' &&
              node.body.length === 1 &&
              node.body[0].type === 'ExpressionStatement')
          ) {
            // it is a block or a single expression
            return
          }
          yield fixer.insertTextBefore(firstToken, '{')
          yield fixer.insertTextAfter(lastToken, '}')
        }
      })
    }
    /**
     * Check if `v-on:click="() => foo()"` can be converted to `v-on:click="foo()"` and report if it can.
     * Returns `true` if reported.
     */
    // eslint-disable-next-line unicorn/consistent-boolean-name -- reports and returns whether it did
    function verifyCanUseInlineHandlerForInlineFunction(
      node: ArrowFunctionExpression | FunctionExpression
    ): boolean {
      // If a function has one parameter, you can turn it into an inline handler using $event.
      // If a function has two or more parameters, it cannot be converted to an inline handler,
      // because $event only holds the first payload. Custom events with multiple payloads
      // are reported on the emitting side by `vue/prefer-single-event-payload` instead.
      if (
        node.params.length > 1 ||
        (shouldUseInlineFunctionForPayload && node.params.length > 0)
      ) {
        return false
      }

      context.report({
        node,
        messageId: 'preferInlineOverInlineFunction',
        fix:
          node.params.length > 0
            ? null /* The function has parameters and cannot be fixed. */
            : (fixer) => {
                let text = sourceCode.getText(node.body)
                if (node.body.type === 'BlockStatement') {
                  text = text.slice(1, -1) // strip braces
                }
                return fixer.replaceText(node, text)
              }
      })
      return true
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
        "VAttribute[directive=true][key.name.name='on'][key.argument!=null] > VExpressionContainer.value:exit"(
          node: VExpressionContainer
        ) {
          const expression = node.expression
          if (!expression) {
            return
          }
          switch (expression.type) {
            case 'VOnExpression': {
              // e.g. v-on:click="foo()"
              if (allows[0] === 'inline') {
                if (
                  shouldUseInlineFunctionForPayload &&
                  hasEventIdentifier(expression)
                ) {
                  // e.g. v-on:click="foo($event)"
                  reportCanUseInlineFunctionForInlineHandler(expression)
                }
                return
              }
              for (const allow of allows) {
                if (verifyForInlineHandler(expression, allow)) {
                  return
                }
              }
              break
            }
            case 'Identifier': {
              // e.g. v-on:click="foo"
              if (allows[0] === 'method') {
                return
              }
              for (const allow of allows) {
                if (reportForMethodHandler(expression, allow)) {
                  return
                }
              }
              break
            }
            case 'ArrowFunctionExpression':
            case 'FunctionExpression': {
              // e.g. v-on:click="()=>foo()"
              if (allows[0] === 'inline-function') {
                return
              }
              for (const allow of allows) {
                if (verifyForInlineFunction(expression, allow)) {
                  return
                }
              }
              break
            }
            default: {
              return
            }
          }
        },
        ...(allows.includes('inline-function')
          ? // Collect $event identifiers to check for side effects
            // when converting from `v-on:click="foo($event)"` to `v-on:click="()=>foo($event)"` .
            {
              'Identifier[name="$event"]'(node: Identifier) {
                $eventIdentifiers.push(node)
              }
            }
          : {})
      },
      allows.includes('method')
        ? // Collect method definition with params information to check for side effects.
          // when converting from `v-on:click="foo()"` to `v-on:click="foo"`, or
          // converting from `v-on:click="() => foo()"` to `v-on:click="foo"`.
          utils.compositingVisitors(
            utils.defineVueVisitor(context, {
              onVueObjectEnter(node) {
                const methods = utils.iterateProperties(
                  node,
                  new Set(['methods'])
                )
                for (const method of methods) {
                  if (method.type !== 'object') {
                    // This branch is usually not passed.
                    continue
                  }
                  const value = method.property.value
                  if (
                    value.type === 'FunctionExpression' ||
                    value.type === 'ArrowFunctionExpression'
                  ) {
                    methodParamCountMap.set(method.name, getParamCount(value))
                  }
                }
              }
            }),
            utils.defineScriptSetupVisitor(context, {
              'Program > FunctionDeclaration'(node: FunctionDeclaration) {
                if (node.id) {
                  methodParamCountMap.set(node.id.name, getParamCount(node))
                }
              },
              "Program > VariableDeclaration[kind='const'] > VariableDeclarator"(
                node: VariableDeclarator
              ) {
                if (
                  node.id.type === 'Identifier' &&
                  (node.init?.type === 'FunctionExpression' ||
                    node.init?.type === 'ArrowFunctionExpression')
                ) {
                  methodParamCountMap.set(
                    node.id.name,
                    getParamCount(node.init)
                  )
                }
              }
            })
          )
        : {}
    )
  }
}
