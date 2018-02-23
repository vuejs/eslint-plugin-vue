/**
 * @author Yosuke Ota
 *
 * issue        https://github.com/vuejs/eslint-plugin-vue/issues/403
 * Style guide: https://vuejs.org/v2/style-guide/#Avoid-v-if-with-v-for-essential
 *
 * I implemented it with reference to `no-confusing-v-for-v-if`
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Check whether the given `v-if` node is using the variable which is defined by the `v-for` directive.
 * @param {ASTNode} vIf The `v-if` attribute node to check.
 * @returns {boolean} `true` if the `v-if` is using the variable which is defined by the `v-for` directive.
 */
function isUsingIterationVar (vIf) {
  const element = vIf.parent.parent
  return vIf.value.references.some(reference =>
    element.variables.some(variable =>
      variable.id.name === reference.id.name &&
      variable.kind === 'v-for'
    )
  )
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'disallow use v-if on the same element as v-for',
      category: undefined,
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.2.2/docs/rules/no-use-v-if-with-v-for.md'
    },
    fixable: null,
    schema: [{
      type: 'object',
      properties: {
        allowUsingIterationVar: {
          type: 'boolean'
        }
      }
    }]
  },

  create (context) {
    const options = context.options[0] || {}
    const allowUsingIterationVar = options.allowUsingIterationVar === true // default false
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name='if']" (node) {
        const element = node.parent.parent

        if (utils.hasDirective(element, 'for')) {
          if (isUsingIterationVar(node)) {
            if (!allowUsingIterationVar) {
              context.report({
                node,
                loc: node.loc,
                message: "The 'v-for' list variable should be replace with a new computed property that returns your filtered list by this 'v-if' condition."
              })
            }
          } else {
            context.report({
              node,
              loc: node.loc,
              message: "This 'v-if' should be moved to the wrapper element."
            })
          }
        }
      }
    })
  }
}
