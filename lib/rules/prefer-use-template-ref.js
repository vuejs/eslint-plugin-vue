/**
 * @author Thomasan1999
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

/** @param expression {Expression | null} */
function expressionIsRef(expression) {
  // @ts-ignore
  return expression?.callee?.name === 'ref'
}

/** @type {import("eslint").Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'require using `useTemplateRef` instead of `ref` for template refs',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/prefer-use-template-ref.html'
    },
    schema: [],
    messages: {
      preferUseTemplateRef: "Replace 'ref' with 'useTemplateRef'."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @type Set<string> */
    const templateRefs = new Set()

    /**
     * @typedef ScriptRef
     * @type {{node: Expression, ref: string}}
     */

    /**
     * @type ScriptRef[] */
    const scriptRefs = []

    return utils.compositingVisitors(
      utils.defineTemplateBodyVisitor(
        context,
        {
          'VAttribute[directive=false]'(node) {
            if (node.key.name === 'ref' && node.value?.value) {
              templateRefs.add(node.value.value)
            }
          }
        },
        {
          VariableDeclarator(declarator) {
            if (!expressionIsRef(declarator.init)) {
              return
            }

            scriptRefs.push({
              // @ts-ignore
              node: declarator.init,
              // @ts-ignore
              ref: declarator.id.name
            })
          }
        }
      ),
      {
        'Program:exit'() {
          for (const templateRef of templateRefs) {
            const scriptRef = scriptRefs.find(
              (scriptRef) => scriptRef.ref === templateRef
            )

            if (!scriptRef) {
              continue
            }

            context.report({
              node: scriptRef.node,
              messageId: 'preferUseTemplateRef'
            })
          }
        }
      }
    )
  }
}
