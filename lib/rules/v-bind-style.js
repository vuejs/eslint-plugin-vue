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
    type: 'suggestion',
    docs: {
      description: 'enforce `v-bind` directive style',
      category: 'strongly-recommended',
      url: 'https://eslint.vuejs.org/rules/v-bind-style.html'
    },
    fixable: 'code',
    schema: [
      { enum: ['shorthand', 'longform'] }
    ]
  },

  create (context) {
    const preferShorthand = context.options[0] !== 'longform'

    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='bind'][key.argument!=null]" (node) {
        const shorthand = node.key.name.rawName === ':' || node.key.name.rawName === '.'
        if (shorthand === preferShorthand) {
          return
        }

        context.report({
          node,
          loc: node.loc,
          message: preferShorthand
            ? "Unexpected 'v-bind' before ':'."
            : "Expected 'v-bind' before ':'.",
          fix: (fixer) => {
            if (preferShorthand) {
              return fixer.removeRange([node.range[0], node.range[0] + 6])
            }
            if (node.key.name.rawName === ':') {
              return fixer.insertTextBefore(node, 'v-bind')
            }
            return null
          }
        })
      }
    })
  }
}
