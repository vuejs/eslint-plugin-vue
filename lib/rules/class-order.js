/**
* @fileoverview Alphabetizes classnames.
* @author Maciej Chmurski
*/
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: 'https://eslint.vuejs.org/rules/class-order.html',
      description: 'enforce classnames order',
      category: undefined
    },
    fixable: 'code',
    schema: []
  },
  create: context => {
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=false][key.name='class']" (node) {
        const classList = node.value.value
        const classListSorted = classList.split(' ').sort().join(' ')

        if (classList !== classListSorted) {
          context.report({
            node,
            loc: node.loc,
            message: 'Classes should be ordered alphabetically.',
            fix: (fixer) => fixer.replaceTextRange(
              [node.value.range[0], node.value.range[1]], `"${classListSorted}"`
            )
          })
        }
      }
    })
  }
}
