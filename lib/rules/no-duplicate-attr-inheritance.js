/**
 * @fileoverview Disable inheritAttrs when using v-bind="$attrs"
 * @author Hiroki Osame
 */
'use strict'

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'enforce inheritAttrs: false when using v-bind="$attrs"',
      category: 'recommended',
      recommended: false,
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0-beta.3/docs/rules/no-duplicate-attr-inheritance.md'
    },
    fixable: null,
    schema: [
      // fill in your schema
    ]
  },

  create (context) {
    let inheritsAttrs = true

    return Object.assign(
      utils.executeOnVue(context, (node) => {
        const inheritAttrsProp = node.properties.find(prop => (prop.type === 'Property' && prop.key.type === 'Identifier' && prop.key.name === 'inheritAttrs'))

        if (inheritAttrsProp && inheritAttrsProp.value.type === 'Literal') {
          inheritsAttrs = inheritAttrsProp.value.value
        }
      }),
      utils.defineTemplateBodyVisitor(context, {
        "VAttribute[directive=true][key.name='bind'][value.expression.name='$attrs']" (node) {
          if (inheritsAttrs) {
            context.report({
              node,
              message: 'Set "inheritAttrs" to false.'
            })
          }
        }
      })
    )
  }
}
