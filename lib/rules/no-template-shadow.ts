/**
 * @fileoverview Disallow variable declarations from shadowing variables declared in the outer scope.
 * @author Armano
 */
import utils from '../utils/index.ts'
import type { GroupName } from '../utils/index.ts'

const GROUP_NAMES: GroupName[] = [
  'props',
  'computed',
  'data',
  'asyncData',
  'methods',
  'setup'
]

function isAllowedVarName(context: RuleContext, variableName: string) {
  return context.options[0]?.allow?.includes(variableName) ?? false
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow variable declarations from shadowing variables declared in the outer scope',
      categories: ['vue3-strongly-recommended', 'vue2-strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/no-template-shadow.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            items: {
              type: 'string'
            },
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      alreadyDeclaredInUpperScope:
        "Variable '{{name}}' is already declared in the upper scope."
    }
  },
  create(context: RuleContext) {
    const jsVars = new Set<string>()

    interface ScopeStack {
      parent: ScopeStack | null
      nodes: Identifier[]
    }
    let scopeStack: ScopeStack | null = null

    return utils.compositingVisitors(
      utils.isScriptSetup(context)
        ? {
            Program() {
              const globalScope = context.sourceCode.scopeManager.globalScope
              if (!globalScope) {
                return
              }
              for (const variable of globalScope.variables) {
                if (variable.defs.length > 0) {
                  jsVars.add(variable.name)
                }
              }
              const moduleScope = globalScope.childScopes.find(
                (scope) => scope.type === 'module'
              )
              if (!moduleScope) {
                return
              }
              for (const variable of moduleScope.variables) {
                if (variable.defs.length > 0) {
                  jsVars.add(variable.name)
                }
              }
            }
          }
        : {},
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(_node, props) {
          for (const prop of props) {
            if (prop.propName) {
              jsVars.add(prop.propName)
            }
          }
        }
      }),
      utils.executeOnVue(context, (obj) => {
        const properties = utils.iterateProperties(obj, new Set(GROUP_NAMES))
        for (const node of properties) {
          jsVars.add(node.name)
        }
      }),
      utils.defineTemplateBodyVisitor(context, {
        VElement(node: VElement) {
          scopeStack = {
            parent: scopeStack,
            nodes: scopeStack ? [...scopeStack.nodes] : []
          }
          for (const variable of node.variables) {
            const varNode = variable.id
            const name = varNode.name

            if (isAllowedVarName(context, name)) {
              continue
            }

            if (
              scopeStack.nodes.some((node) => node.name === name) ||
              jsVars.has(name)
            ) {
              context.report({
                node: varNode,
                loc: varNode.loc,
                messageId: 'alreadyDeclaredInUpperScope',
                data: {
                  name
                }
              })
            } else {
              scopeStack.nodes.push(varNode)
            }
          }
        },
        'VElement:exit'() {
          scopeStack &&= scopeStack.parent
        }
      })
    )
  }
}
