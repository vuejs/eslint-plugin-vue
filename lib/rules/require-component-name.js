/**
 * @fileoverview Require components to have names
 * @author Hiroki Osame <hiroki.osame@gmail.com>
 */
'use strict'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
const utils = require('../utils')

module.exports = {
  meta: {
    docs: {
      description: 'require components to have names',
      category: 'recommended',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0-beta.3/docs/rules/require-component-name.md'
    },
    fixable: null,
    schema: [
    ]
  },

  create (context) {
    return utils.executeOnVueComponent(context, (obj) => {
      const hasName = obj.properties.find(prop => prop.key.name === 'name')
      if (!hasName) {
        context.report({
          obj,
          loc: obj.loc,
          message: 'Expected component to have a name.'
        })
      }
    })
  }
}
