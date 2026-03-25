/**
 * @author Flo Edelmann
 * See LICENSE file in root directory for full license.
 */
import { camelCase } from '../utils/casing.ts'
import utils from '../utils/index.js'

/**
 * Get the static argument name of a directive, or `null` for dynamic arguments.
 */
const getStaticArgName = (directive: VDirective): string | null =>
  directive.key.argument?.type === 'VIdentifier'
    ? directive.key.argument.rawName
    : null

/**
 * Extract the prop name from an `update:propName` event directive argument.
 */
function getUpdateEventPropName(onDirective: VDirective): string | null {
  const argName = getStaticArgName(onDirective)
  if (!argName?.startsWith('update:')) {
    return null
  }
  return argName.slice('update:'.length)
}

/**
 * Check if the event handler is a simple mirror assignment of the bind expression.
 * Matches: `bar = $event` or `(param) => bar = param`
 */
function isMirrorAssignment(
  bindExpr: Expression,
  onExpr: VOnExpression | Expression,
  sourceCode: SourceCode
): boolean {
  const bindText = sourceCode.getText(bindExpr as ASTNode)

  // Form A: VOnExpression with "bar = $event"
  if (onExpr.type === 'VOnExpression') {
    const statements = onExpr.body
    if (statements.length !== 1) {
      return false
    }
    const stmt = statements[0]
    if (stmt.type !== 'ExpressionStatement') {
      return false
    }
    const expr = stmt.expression
    if (expr.type !== 'AssignmentExpression' || expr.operator !== '=') {
      return false
    }
    const lhsText = sourceCode.getText(expr.left as ASTNode)
    return (
      lhsText === bindText &&
      expr.right.type === 'Identifier' &&
      expr.right.name === '$event'
    )
  }

  // Form B: ArrowFunctionExpression "(param) => bar = param"
  if (onExpr.type === 'ArrowFunctionExpression') {
    if (onExpr.params.length !== 1) {
      return false
    }
    const param = onExpr.params[0]
    if (param.type !== 'Identifier') {
      return false
    }
    const body = onExpr.body
    if (body.type !== 'AssignmentExpression' || body.operator !== '=') {
      return false
    }
    const lhsText = sourceCode.getText(body.left as ASTNode)
    return (
      lhsText === bindText &&
      body.right.type === 'Identifier' &&
      body.right.name === param.name
    )
  }

  return false
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce using `v-model` instead of `:prop`/`@update:prop` pair',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/prefer-v-model.html'
    },
    fixable: null,
    hasSuggestions: true,
    schema: [],
    messages: {
      preferVModel:
        'Prefer `{{ vModelName }}` over the `:{{ propName }}`/`@update:{{ eventName }}` pair.',
      replaceWithVModel: 'Replace with `{{ vModelName }}`.'
    }
  },
  create(context: RuleContext) {
    const sourceCode = context.sourceCode

    return utils.defineTemplateBodyVisitor(context, {
      VStartTag(node) {
        const element = node.parent
        if (!utils.isCustomComponent(element)) {
          return
        }

        const bindDirectives: VDirective[] = []
        const onDirectives: VDirective[] = []

        for (const attr of node.attributes) {
          if (!attr.directive) continue
          if (
            attr.key.name.name === 'bind' &&
            getStaticArgName(attr) != null &&
            attr.key.modifiers.length === 0
          ) {
            bindDirectives.push(attr)
          }
          if (
            attr.key.name.name === 'on' &&
            getUpdateEventPropName(attr) != null &&
            attr.key.modifiers.length === 0
          ) {
            onDirectives.push(attr)
          }
        }

        for (const bindDir of bindDirectives) {
          const propName = getStaticArgName(bindDir)
          if (!propName) {
            continue
          }

          const normalizedBindName = camelCase(propName)

          const matchingOnDir = onDirectives.find(
            (onDir) =>
              camelCase(getUpdateEventPropName(onDir)!) === normalizedBindName
          )

          if (!matchingOnDir) {
            continue
          }

          const bindExpr = bindDir.value?.expression
          const onExpr = matchingOnDir.value?.expression
          if (
            !bindExpr ||
            bindExpr.type === 'VFilterSequenceExpression' ||
            bindExpr.type === 'VForExpression' ||
            bindExpr.type === 'VOnExpression' ||
            bindExpr.type === 'VSlotScopeExpression' ||
            !onExpr ||
            !isMirrorAssignment(
              bindExpr,
              onExpr as VOnExpression | Expression,
              sourceCode
            )
          ) {
            continue
          }

          const isModelValue = normalizedBindName === 'modelValue'
          const vModelName = isModelValue ? 'v-model' : `v-model:${propName}`
          const eventName = getUpdateEventPropName(matchingOnDir) ?? propName

          const bindValueText = sourceCode.getText(
            bindDir.value!.expression as ASTNode
          )
          const vModelText = `${vModelName}="${bindValueText}"`

          context.report({
            node: bindDir,
            messageId: 'preferVModel',
            data: {
              vModelName,
              propName,
              eventName
            },
            suggest: [
              {
                messageId: 'replaceWithVModel',
                data: { vModelName },
                fix(fixer) {
                  const fixes = [fixer.replaceText(bindDir, vModelText)]

                  // Remove the on directive including preceding whitespace
                  const text = sourceCode.getText()
                  let removeStart = matchingOnDir.range[0]
                  while (
                    removeStart > 0 &&
                    (text[removeStart - 1] === ' ' ||
                      text[removeStart - 1] === '\t')
                  ) {
                    removeStart--
                  }
                  fixes.push(
                    fixer.removeRange([removeStart, matchingOnDir.range[1]])
                  )

                  return fixes
                }
              }
            ]
          })
        }
      }
    })
  }
}
