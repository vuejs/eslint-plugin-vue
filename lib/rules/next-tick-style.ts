/**
 * @fileoverview enforce Promise or callback style in `nextTick`
 * @author Flo Edelmann
 * @copyright 2020 Flo Edelmann. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import vueEslintParser from 'vue-eslint-parser'
import utils from '../utils/index.js'
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
 * Checks whether the call is the last statement of the given function, so
 * nothing else in that function runs between the call and the callback.
 */
function isLastStatementOf(
  callExpression: CallExpression,
  func: FunctionDeclaration | FunctionExpression | ArrowFunctionExpression
): boolean {
  return (
    func.body.type === 'BlockStatement' &&
    func.body.body.at(-1) === callExpression.parent
  )
}

/**
 * Returns the callback if its body can be moved after `await nextTick()`:
 * the call is a statement in a block, and the callback is a sync arrow
 * function without parameters, declarations, `return` or labels.
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
    callback.async ||
    sourceCode.scopeManager.acquire(callback)!.variables.length > 0
  ) {
    return null
  }

  let hasOwnReturnOrLabel = false
  traverseNodes(callback.body, {
    visitorKeys: sourceCode.visitorKeys,
    enterNode(node) {
      if (
        (node.type === 'ReturnStatement' || node.type === 'LabeledStatement') &&
        getUpperFunction(node) === callback
      ) {
        hasOwnReturnOrLabel = true
      }
    },
    leaveNode() {}
  })
  return hasOwnReturnOrLabel ? null : callback
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
  const bodyStart = isBlockBody
    ? callback.body.range[0] + 1
    : sourceCode.getTokenBefore(callback.body, { filter: isArrowToken })!
        .range[1]
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

  const bodyText = sourceCode.text.slice(bodyStart, bodyEnd)
  const trimmedText = bodyText.trim()
  if (!isBlockBody) {
    if (/^(?:function|class)\b/u.test(trimmedText)) {
      return null
    }
    const semicolon =
      sourceCode.getLastToken(statement).value === ';' ? ';' : ''
    return `${awaitText} ${trimmedText}${semicolon}`
  }
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
    const node = sourceCode.getNodeByRangeIndex(lineStart)
    lineStart += line.length + 1
    const isInsideString =
      node?.type === 'TemplateElement' || node?.type === 'Literal'
    return index === 0 || isInsideString || !line.startsWith(bodyIndent)
      ? line
      : statementIndent + line.slice(bodyIndent.length)
  })
  return `${awaitText}\n${statementIndent}${lines.join('\n')}`
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
