/**
 * @author Kamogelo Moalusi
 * @author Valentin Yushkevich
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'

function isExpression(node: Declaration | Expression): node is Expression {
  return ![
    'FunctionDeclaration',
    'VariableDeclaration',
    'ClassDeclaration'
  ].includes(node.type)
}

/**
 * Skips `as` and `satisfies` wrappers, e.g. `({} as A) satisfies B`.
 */
function skipTypeAssertions(
  node: Expression | SpreadElement
): Expression | SpreadElement {
  let current = node
  while (
    current.type === 'TSAsExpression' ||
    // `TSSatisfiesExpression` is not part of the bundled AST typings.
    (current.type as string) === 'TSSatisfiesExpression'
  ) {
    current = (current as TSAsExpression).expression
  }
  return current
}

function isVueExtendCall(
  node: Expression | SpreadElement
): node is CallExpression {
  if (node.type !== 'CallExpression') {
    return false
  }
  const callee = node.callee
  const lastArgument = node.arguments.at(-1)
  return (
    callee.type === 'MemberExpression' &&
    callee.object.type === 'Identifier' &&
    callee.object.name === 'Vue' &&
    utils.getStaticPropertyName(callee) === 'extend' &&
    lastArgument != null &&
    skipTypeAssertions(lastArgument).type === 'ObjectExpression'
  )
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require components to be defined using `defineComponent`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/prefer-define-component.html'
    },
    fixable: null,
    schema: [],
    messages: {
      preferDefineComponent: 'Use `defineComponent` to define the component.'
    }
  },
  create(context: RuleContext): RuleListener {
    if (!utils.isVueFile(context.filename) || utils.isScriptSetup(context)) {
      return {}
    }

    return {
      ExportDefaultDeclaration(node) {
        if (!isExpression(node.declaration)) {
          return
        }
        const declaration = skipTypeAssertions(node.declaration)
        if (
          declaration.type === 'ObjectExpression' ||
          isVueExtendCall(declaration)
        ) {
          context.report({
            node,
            messageId: 'preferDefineComponent'
          })
        }
      }
    }
  }
}
