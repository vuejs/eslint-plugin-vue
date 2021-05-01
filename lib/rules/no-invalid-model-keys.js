/**
 * @fileoverview Requires valid keys in model option.
 * @author Alex Sokolov
 */
'use strict'

const utils = require('../utils')

/**
 * @typedef {import('../utils').GroupName} GroupName
 */

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
const VALID_MODEL_KEYS = ['prop', 'event']

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require valid keys in model option',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-invalid-model-keys.html'
    },
    fixable: null,
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.executeOnVue(context, (obj) => {
      const modelProperty = utils.findProperty(obj, 'model')
      if (!modelProperty || modelProperty.value.type !== 'ObjectExpression') {
        return
      }

      for (const p of modelProperty.value.properties) {
        if (p.type !== 'Property') {
          continue
        }
        const name = utils.getStaticPropertyName(p)
        if (!name) {
          continue
        }
        if (VALID_MODEL_KEYS.indexOf(name) === -1) {
          context.report({
            node: p,
            message: "Invalid key '{{name}}' in model option.",
            data: {
              name
            }
          })
        }
      }
    })
  }
}
