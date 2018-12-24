/**
 * @fileoverview Prevents require: false on props.
 * @author sizer
 */
'use strict'

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow require: false on props',
      category: 'recommended',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0/docs/rules/no-require-false.md'
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      {
        type: 'object',
        properties: {
          groups: {
            type: 'array'
          }
        },
        additionalProperties: false
      }
    ]
  },

  create (context) {
    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.executeOnVue(context, (obj) => {
      utils
        .getComponentProps(obj)
        .filter(prop => {
          if (prop.value == null) {
            return false
          }

          prop.value.properties.filter(p => {
            const require = p.key.name
            if (require !== 'require' || p.value.value) {
              return false
            }

            context.report({
              node: p,
              message: "Remove require: false on '{{name}}'.",
              data: {
                name: prop.key.name
              }
            })
          })
        })
    })
  }
}
