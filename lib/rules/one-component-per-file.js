/**
 * @fileoverview enforce that each component should be in its own file
 * @author Armano
 */
'use strict'
const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce that each component should be in its own file',
      category: undefined, // strongly-recommended
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0-beta.5/docs/rules/one-component-per-file.md'
    },
    fixable: null,
    schema: [],
    messages: {
      toManyComponents: 'There is more than one component in this file.'
    }
  },
  create (context) {
    let componentCount = 0

    return Object.assign({},
      utils.executeOnVueComponent(context, () => {
        ++componentCount
      }),
      {
        'Program:exit' (node) {
          if (componentCount > 1) {
            context.report({
              node: node,
              messageId: 'toManyComponents'
            })
          }
        }
      }
    )
  }
}
