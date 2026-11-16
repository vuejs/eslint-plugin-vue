/**
 * @author Valentin Yushkevich
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'

const FUNCTION_NAMES = new Set(['setup', 'data', 'asyncData'])

interface TargetFunctionData {
  name: string
  /** The last `return` statement directly in the function body, if any. */
  finalReturn: ReturnStatement | null
}

/**
 * Finds the last `return` statement directly in the given function body.
 * Only one such statement can be reached.
 */
function findFinalReturn(body: BlockStatement): ReturnStatement | null {
  for (let i = body.body.length - 1; i >= 0; i--) {
    const statement = body.body[i]
    if (statement.type === 'ReturnStatement') {
      return statement
    }
  }
  return null
}

/**
 * Finds the function that the given `return` statement exits.
 */
function getOwnerFunction(node: ReturnStatement): ASTNode | null {
  let parent: ASTNode | null = node.parent
  while (
    parent &&
    parent.type !== 'FunctionExpression' &&
    parent.type !== 'FunctionDeclaration' &&
    parent.type !== 'ArrowFunctionExpression'
  ) {
    parent = parent.parent
  }
  return parent
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow early `return` in `setup`, `data` and `asyncData` functions',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-early-return.html'
    },
    fixable: null,
    schema: [],
    messages: {
      extraReturnStatement:
        'Only one (unconditional) return statement is allowed in {{functionType}} function.'
    }
  },
  create(context: RuleContext) {
    const targetFunctions = new Map<ASTNode, TargetFunctionData>()

    return utils.defineVueVisitor(context, {
      onVueObjectEnter(node) {
        for (const property of node.properties) {
          if (property.type !== 'Property') {
            continue
          }
          const name = utils.getStaticPropertyName(property)
          if (!name || !FUNCTION_NAMES.has(name)) {
            continue
          }
          const value = property.value
          if (
            (value.type !== 'FunctionExpression' &&
              value.type !== 'ArrowFunctionExpression') ||
            value.body.type !== 'BlockStatement'
          ) {
            continue
          }
          targetFunctions.set(value, {
            name,
            finalReturn: findFinalReturn(value.body)
          })
        }
      },
      ReturnStatement(node) {
        const ownerFunction = getOwnerFunction(node)
        const target = ownerFunction && targetFunctions.get(ownerFunction)
        if (!target || target.finalReturn === node) {
          return
        }
        context.report({
          node,
          messageId: 'extraReturnStatement',
          data: { functionType: target.name }
        })
      }
    })
  }
}
