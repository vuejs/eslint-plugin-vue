/**
 * @author Thomasan1999
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

/**
 * @typedef ScriptRef
 * @type {[string, CallExpression]}
 */

/**
 * @param body {(Statement | ModuleDeclaration)[]}
 * @returns {ScriptRef[]}
 * */
function getScriptRefsFromSetupFunction(body) {
  return body.flatMap((child) => {
    if (child.type === 'VariableDeclaration') {
      const declarator = child.declarations[0]

      if (
        declarator.init?.type === 'CallExpression' &&
        declarator.init.callee?.type === 'Identifier' &&
        declarator.id.type === 'Identifier' &&
        ['ref', 'shallowRef'].includes(declarator.init.callee.name)
      )
        return [[declarator.id.name, declarator.init]]
    }

    return []
  })
}

/** @type {import("eslint").Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'require using `useTemplateRef` instead of `ref`/`shallowRef` for template refs',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/prefer-use-template-ref.html'
    },
    schema: [],
    messages: {
      preferUseTemplateRef: "Replace '{{name}}' with 'useTemplateRef'."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @type Set<string> */
    const templateRefs = new Set()

    /**
     * @type ScriptRef[] */
    const scriptRefs = []

    return utils.compositingVisitors(
      utils.defineTemplateBodyVisitor(context, {
        'VAttribute[directive=false]'(node) {
          if (node.key.name === 'ref' && node.value?.value) {
            templateRefs.add(node.value.value)
          }
        }
      }),
      utils.defineVueVisitor(context, {
        onSetupFunctionEnter(node) {
          if (node.type === 'ArrowFunctionExpression' && node.expression) {
            return
          }
          const newScriptRefs = getScriptRefsFromSetupFunction(node.body.body)
          scriptRefs.push(...newScriptRefs)
        }
      }),
      utils.defineScriptSetupVisitor(context, {
        Program(node) {
          const newScriptRefs = getScriptRefsFromSetupFunction(node.body)

          scriptRefs.push(...newScriptRefs)
        }
      }),
      {
        'Program:exit'() {
          const scriptRefsMap = new Map(scriptRefs)

          for (const templateRef of templateRefs) {
            const scriptRef = scriptRefsMap.get(templateRef)

            if (!scriptRef) {
              continue
            }

            context.report({
              node: scriptRef,
              messageId: 'preferUseTemplateRef',
              data: {
                name: /** @type {Identifier} */ (scriptRef.callee).name
              }
            })
          }
        }
      }
    )
  }
}
