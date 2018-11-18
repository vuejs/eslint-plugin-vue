/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require `v-bind:key` with `v-for` directives',
      category: 'essential',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0-beta.4/docs/rules/require-v-for-key.md'
    },
    fixable: null,
    schema: []
  },

  create (context) {
    /**
     * Check the given element about `v-bind:key` attributes.
     * @param {ASTNode} element The element node to check.
     */
    function checkKey (element) {
      if (element.name === 'template' || element.name === 'slot') {
        for (const child of element.children) {
          if (child.type === 'VElement') {
            checkKey(child)
          }
        }
      } else if (!utils.isCustomComponent(element) && !utils.hasDirective(element, 'bind', 'key')) {
        context.report({
          node: element.startTag,
          loc: element.startTag.loc,
          message: "Elements in iteration expect to have 'v-bind:key' directives."
        })
      }
    }

    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name='for']" (node) {
        checkKey(node.parent.parent)
      }
    })
  }
}
