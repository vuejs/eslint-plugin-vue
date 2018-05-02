'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const errorMessage = `onBlur must be used instead of onchange, \
  unless absolutely necessary and it causes no negative consequences \
  for keyboard only or screen reader users.`

module.exports = {
  meta: {
    docs: {
      description: 'require onblur to be used instead of onchange',
      category: 'accessible',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.4.0/docs/rules/no-onchange.md'
    },
    fixable: null,
    schema: []
  },

  create (context) {
    /**
     * Check the given element about `onchange` attributes.
     * @param {ASTNode} element The element node to check.
     */
    function checkElement (element) {
      const attribute = utils.hasAttribute(element, 'onchange') && !utils.hasAttribute(element, 'onblur')
      const directive = utils.hasDirective(element, 'on', 'onchange') && !utils.hasDirective(element, 'on', 'onblur')
      if (attribute || directive) {
        context.report({
          node: element.startTag,
          loc: element.startTag.loc,
          message: errorMessage
        })
      }
    }

    return utils.defineTemplateBodyVisitor(context, {
      "VElement[name='select']" (node) {
        checkElement(node)
      },
      "VElement[name='option']" (node) {
        checkElement(node)
      }
    })
  }
}
