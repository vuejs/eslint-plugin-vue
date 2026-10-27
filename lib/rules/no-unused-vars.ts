/**
 * @fileoverview disallow unused variable definitions of v-for directives or scope attributes.
 * @author 薛定谔的猫<hh_2013@foxmail.com>
 */
import utils from '../utils/index.js'

type VariableKind = VVariable['kind']

/**
 * Groups variables by directive kind.
 */
function groupingVariables(node: VElement): {
  [kind in VariableKind]?: VVariable[]
} {
  const result: { [kind in VariableKind]?: VVariable[] } = {}
  for (const variable of node.variables) {
    const kind = variable.kind
    result[kind] ||= []
    result[kind].push(variable)
  }
  return result
}

/**
 * Checks if the given variable was defined by destructuring.
 */
function isDestructuringVar(variable: VVariable): boolean {
  const node = variable.id
  let parent: ASTNode | null = node.parent
  while (parent) {
    if (
      parent.type === 'VForExpression' ||
      parent.type === 'VSlotScopeExpression'
    ) {
      return false
    }
    if (parent.type === 'Property' || parent.type === 'ArrayPattern') {
      return true
    }
    parent = parent.parent
  }
  return false
}

/**
 * Checks if the given variable name is used as a component tag in the element's descendants.
 */
function isUsedAsComponentTag(
  variableName: string,
  element: VElement
): boolean {
  for (const child of element.children) {
    if (child.type !== 'VElement') {
      continue
    }

    // Check if the tag name matches the variable name (PascalCase component), otherwise recursively check children
    if (
      child.rawName === variableName ||
      isUsedAsComponentTag(variableName, child)
    ) {
      return true
    }
  }
  return false
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow unused variable definitions of v-for directives or scope attributes',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-unused-vars.html'
    },
    fixable: null,
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        properties: {
          ignorePattern: {
            type: 'string'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unusedVariable: "'{{name}}' is defined but never used.",
      replaceWithUnderscore:
        'Replace `{{name}}` with `_{{name}}` to ignore the unused variable.'
    }
  },
  create(context: RuleContext) {
    const option = context.options[0] || {}
    const ignorePattern = option.ignorePattern
    const ignoreRegEx: RegExp | null = ignorePattern
      ? new RegExp(ignorePattern, 'u')
      : null

    /**
     * Checks the variables of a single directive kind.
     */
    function checkVariableGroup(variables: VVariable[], node: VElement) {
      let hasAfterUsed = false

      for (let i = variables.length - 1; i >= 0; i--) {
        const variable = variables[i]

        if (variable.references.length > 0) {
          hasAfterUsed = true
          continue
        }

        if (
          (ignoreRegEx != null && ignoreRegEx.test(variable.id.name)) ||
          (hasAfterUsed && !isDestructuringVar(variable)) || // skip If a variable after the variable is used
          isUsedAsComponentTag(variable.id.name, node) // check if the variable is used as a component tag in descendants
        ) {
          continue
        }

        context.report({
          node: variable.id,
          loc: variable.id.loc,
          messageId: 'unusedVariable',
          data: {
            name: variable.id.name
          },
          suggest:
            ignorePattern === '^_'
              ? [
                  {
                    messageId: 'replaceWithUnderscore',
                    data: { name: variable.id.name },
                    fix(fixer) {
                      return fixer.replaceText(
                        variable.id,
                        `_${variable.id.name}`
                      )
                    }
                  }
                ]
              : []
        })
      }
    }

    return utils.defineTemplateBodyVisitor(context, {
      VElement(node: VElement) {
        const vars = groupingVariables(node)
        for (const variables of Object.values(vars)) {
          if (variables) {
            checkVariableGroup(variables, node)
          }
        }
      }
    })
  }
}
