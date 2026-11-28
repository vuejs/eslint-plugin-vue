/**
 * @fileoverview enforce Promise or callback style in `nextTick`
 * @author Flo Edelmann
 * @copyright 2020 Flo Edelmann. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import vueEslintParser from 'vue-eslint-parser'
import utils from '../utils/index.ts'
import { findVariable, isArrowToken } from '@eslint-community/eslint-utils'

const traverseNodes = vueEslintParser.AST.traverseNodes

function getVueNextTickCallExpression(
  identifier: Identifier,
  context: RuleContext
): CallExpression | undefined {
  // Instance API: this.$nextTick()
  // and Vue 2 Global API: Vue.nextTick()
  if (
    identifier.parent.type === 'MemberExpression' &&
    identifier.parent.parent.type === 'CallExpression' &&
    identifier.parent.parent.callee === identifier.parent &&
    ((identifier.name === '$nextTick' &&
      utils.isThis(identifier.parent.object, context)) ||
      (identifier.name === 'nextTick' &&
        identifier.parent.object.type === 'Identifier' &&
        identifier.parent.object.name === 'Vue'))
  ) {
    return identifier.parent.parent
  }

  // Vue 3 Global API: import { nextTick as nt } from 'vue'; nt()
  if (
    identifier.parent.type === 'CallExpression' &&
    identifier.parent.callee === identifier
  ) {
    const variable = findVariable(
      utils.getScope(context, identifier),
      identifier
    )

    if (variable != null && variable.defs.length === 1) {
      const def = variable.defs[0]
      if (
        def.type === 'ImportBinding' &&
        def.node.type === 'ImportSpecifier' &&
        def.node.imported.type === 'Identifier' &&
        def.node.imported.name === 'nextTick' &&
        def.node.parent.type === 'ImportDeclaration' &&
        def.node.parent.source.value === 'vue'
      ) {
        return identifier.parent
      }
    }
  }

  return undefined
}

function isAwaitedPromise(callExpression: CallExpression): boolean {
  return (
    callExpression.parent.type === 'AwaitExpression' ||
    (callExpression.parent.type === 'MemberExpression' &&
      callExpression.parent.property.type === 'Identifier' &&
      callExpression.parent.property.name === 'then')
  )
}

function getUpperFunction(
  node: ASTNode
):
  | FunctionDeclaration
  | FunctionExpression
  | ArrowFunctionExpression
  | StaticBlock
  | null {
  for (let parent = node.parent; parent; parent = parent.parent) {
    switch (parent.type) {
      case 'FunctionDeclaration':
      case 'FunctionExpression':
      case 'ArrowFunctionExpression':
      case 'StaticBlock': {
        return parent
      }
    }
  }
  return null
}

function getAsyncFunction(
  node: ASTNode
): FunctionDeclaration | FunctionExpression | ArrowFunctionExpression | null {
  const upperFunction = getUpperFunction(node)
  return upperFunction &&
    upperFunction.type !== 'StaticBlock' &&
    upperFunction.async
    ? upperFunction
    : null
}

/**
 * Checks whether nothing else in the given function runs after the call:
 * the call and every enclosing statement up to the function body are the
 * last statement of their block, and the only enclosing statements are
 * blocks and `if` statements (no loops, `try`, `switch` or labels).
 */
function isLastStatementOf(
  callExpression: CallExpression,
  func: FunctionDeclaration | FunctionExpression | ArrowFunctionExpression
): boolean {
  let node: ASTNode = callExpression.parent
  while (node !== func.body) {
    const parent = node.parent
    if (parent?.type === 'BlockStatement') {
      if (parent.body.at(-1) !== node) {
        return false
      }
    } else if (parent?.type !== 'IfStatement') {
      return false
    }
    node = parent
  }
  return true
}

/**
 * Checks whether the given function body starts with a directive such as
 * `'use strict'`, which would lose its effect after the move.
 */
function hasDirective(body: BlockStatement): boolean {
  const firstStatement = body.body[0]
  return (
    firstStatement?.type === 'ExpressionStatement' &&
    firstStatement.expression.type === 'Literal' &&
    typeof firstStatement.expression.value === 'string'
  )
}

/**
 * Returns the callback if its body can be moved after `await nextTick()`:
 * the call is a statement in a block of strict mode code, and the callback
 * is a sync arrow function without parameters, declarations, directives,
 * `return`, labels or `await` identifiers.
 * In sloppy mode code, a function declaration in a nested block would be
 * hoisted to the outer function, and `yield` could become an expression.
 */
function getMovableCallback(
  callExpression: CallExpression,
  sourceCode: SourceCode
): ArrowFunctionExpression | null {
  const statement = callExpression.parent
  const callback = callExpression.arguments[0]
  if (
    statement.type !== 'ExpressionStatement' ||
    statement.parent.type !== 'BlockStatement' ||
    callExpression.arguments.length !== 1 ||
    callback.type !== 'ArrowFunctionExpression' ||
    callback.async
  ) {
    return null
  }
  const scope = sourceCode.scopeManager.acquire(callback)!
  if (
    !scope.isStrict ||
    scope.variables.length > 0 ||
    (callback.body.type === 'BlockStatement' && hasDirective(callback.body))
  ) {
    return null
  }

  let isMovable = true
  traverseNodes(callback.body, {
    visitorKeys: sourceCode.visitorKeys,
    enterNode(node) {
      if (
        // `await` is an identifier in scripts, but an operator after the move
        (node.type === 'Identifier' && node.name === 'await') ||
        ((node.type === 'ReturnStatement' ||
          node.type === 'LabeledStatement') &&
          getUpperFunction(node) === callback)
      ) {
        isMovable = false
      }
    },
    leaveNode() {}
  })
  return isMovable ? callback : null
}

/**
 * Checks whether an expression starting with the given tokens would be read
 * as a declaration at the start of a statement. `{` cannot start an arrow
 * function's expression body, and `let` is reserved in strict mode code.
 */
function isAmbiguousStatementStart(
  firstToken: Token,
  secondToken: Token | undefined
): boolean {
  return (
    firstToken.value === 'function' ||
    firstToken.value === 'class' ||
    (firstToken.value === 'async' && secondToken?.value === 'function')
  )
}

/**
 * Checks whether a statement ending with the given token would be continued
 * by the code after it without a `;`.
 */
function requiresSemicolonAfter(token: Token, sourceCode: SourceCode): boolean {
  if (token.value === ';') {
    return false
  }
  if (token.value !== '}') {
    return true
  }
  // a block or `switch` statement ends the statement, but a function body or
  // an object literal does not
  const node = sourceCode.getNodeByRangeIndex(token.range[0])
  return node?.type === 'BlockStatement'
    ? [
        'FunctionDeclaration',
        'FunctionExpression',
        'ArrowFunctionExpression'
      ].includes(node.parent.type)
    : node?.type !== 'SwitchStatement'
}

function getAwaitText(
  callExpression: CallExpression,
  sourceCode: SourceCode
): string | null {
  const callback = getMovableCallback(callExpression, sourceCode)
  if (!callback) {
    return null
  }

  const statement = callExpression.parent
  const awaitText = `await ${sourceCode.getText(callExpression.callee)}();`
  const isBlockBody = callback.body.type === 'BlockStatement'
  const arrowToken = sourceCode.getTokenBefore(callback.body, {
    filter: isArrowToken
  })!
  const bodyStart = isBlockBody
    ? callback.body.range[0] + 1
    : arrowToken.range[1]
  const bodyEnd = isBlockBody ? callback.body.range[1] - 1 : callback.range[1]
  if (
    sourceCode
      .getCommentsInside(statement)
      .some(
        (comment) => comment.range[0] < bodyStart || comment.range[1] > bodyEnd
      )
  ) {
    return null
  }

  const semicolon = sourceCode.getLastToken(statement).value === ';' ? ';' : ''
  if (callback.body.type !== 'BlockStatement') {
    const trimmedText = sourceCode.text.slice(bodyStart, bodyEnd).trim()
    const [firstToken, secondToken] = sourceCode.getTokensAfter(arrowToken, {
      count: 2
    })
    return isAmbiguousStatementStart(firstToken, secondToken)
      ? `${awaitText} (${trimmedText})${semicolon}`
      : `${awaitText} ${trimmedText}${semicolon}`
  }

  // keep the statement's `;` after the moved body, so that the code after
  // the statement does not continue the last moved statement
  const closingBrace = sourceCode.getLastToken(callback.body)!
  const lastBodyToken = sourceCode.getTokenBefore(closingBrace)!
  const semicolonIndex =
    semicolon &&
    callback.body.body.length > 0 &&
    requiresSemicolonAfter(lastBodyToken, sourceCode)
      ? lastBodyToken.range[1]
      : Infinity
  const bodyText =
    semicolonIndex === Infinity
      ? sourceCode.text.slice(bodyStart, bodyEnd)
      : `${sourceCode.text.slice(bodyStart, semicolonIndex)};${sourceCode.text.slice(semicolonIndex, bodyEnd)}`
  const trimmedText = bodyText.trim()
  if (!trimmedText) {
    return awaitText
  }

  const getIndent = (line: number): string =>
    /^\s*/u.exec(sourceCode.lines[line - 1])![0]
  const textStart = bodyStart + bodyText.length - bodyText.trimStart().length
  const statementIndent = getIndent(statement.loc.start.line)
  const bodyIndent = getIndent(sourceCode.getLocFromIndex(textStart).line)
  let lineStart = textStart
  const lines = trimmedText.split('\n').map((line, index) => {
    const node = sourceCode.getNodeByRangeIndex(
      lineStart > semicolonIndex ? lineStart - 1 : lineStart
    )
    lineStart += line.length + 1
    const isInsideString =
      node?.type === 'TemplateElement' || node?.type === 'Literal'
    return index === 0 || isInsideString || !line.startsWith(bodyIndent)
      ? line
      : statementIndent + line.slice(bodyIndent.length)
  })

  // a trailing line comment must not comment out the code after the statement
  const lastBodyTokenOrComment = sourceCode.getTokenBefore(closingBrace, {
    includeComments: true
  })!
  const nextToken = sourceCode.getTokenAfter(statement, {
    includeComments: true
  })
  const eol = /\r?\n/u.exec(sourceCode.text)?.[0] ?? '\n'
  const lineBreak =
    lastBodyTokenOrComment.type === 'Line' &&
    nextToken?.loc.start.line === statement.loc.end.line
      ? `${eol}${statementIndent}`
      : ''
  return `${awaitText}${eol}${statementIndent}${lines.join('\n')}${lineBreak}`
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce Promise or callback style in `nextTick`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/next-tick-style.html'
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [{ enum: ['promise', 'callback'] }],
    messages: {
      usePromise:
        'Use the Promise returned by `nextTick` instead of passing a callback function.',
      useAwait: 'Use `await nextTick()`.',
      useThen: 'Use `nextTick().then()`.',
      useCallback:
        'Pass a callback function to `nextTick` instead of using the returned Promise.'
    }
  },
  create(context: RuleContext) {
    const preferredStyle =
      (context.options[0] as string | undefined) || 'promise'

    return utils.defineVueVisitor(context, {
      Identifier(node: Identifier) {
        const callExpression = getVueNextTickCallExpression(node, context)
        if (!callExpression) {
          return
        }

        if (preferredStyle === 'callback') {
          if (
            callExpression.arguments.length !== 1 ||
            isAwaitedPromise(callExpression)
          ) {
            context.report({
              node,
              messageId: 'useCallback'
            })
          }

          return
        }

        if (
          callExpression.arguments.length === 0 &&
          isAwaitedPromise(callExpression)
        ) {
          return
        }

        // an optional call does nothing when `nextTick` is missing, and
        // `this.$nextTick()` and `Vue.nextTick()` call a `function` callback
        // with another `this` or other arguments than `.then()` does
        if (
          callExpression.optional ||
          (callExpression.callee.type === 'MemberExpression' &&
            (callExpression.callee.optional ||
              callExpression.arguments[0]?.type === 'FunctionExpression'))
        ) {
          context.report({
            node,
            messageId: 'usePromise'
          })
          return
        }

        const fixToThen = (fixer: RuleFixer) =>
          fixer.insertTextAfter(node, '().then')
        const asyncFunction = getAsyncFunction(callExpression)
        if (!asyncFunction) {
          context.report({
            node,
            messageId: 'usePromise',
            fix: fixToThen
          })
          return
        }

        const awaitText = getAwaitText(callExpression, context.sourceCode)
        const fixToAwait = (fixer: RuleFixer) =>
          fixer.replaceText(callExpression.parent, awaitText!)
        if (awaitText && isLastStatementOf(callExpression, asyncFunction)) {
          context.report({
            node,
            messageId: 'usePromise',
            fix: fixToAwait
          })
          return
        }

        // elsewhere in an `async` function, `await` would also delay the code
        // after the call, so both styles are only suggested
        context.report({
          node,
          messageId: 'usePromise',
          suggest: [
            ...(awaitText ? [{ messageId: 'useAwait', fix: fixToAwait }] : []),
            { messageId: 'useThen', fix: fixToThen }
          ]
        })
      }
    })
  }
}
