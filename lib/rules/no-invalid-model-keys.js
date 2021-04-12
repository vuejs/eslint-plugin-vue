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
/** @type {GroupName[]} */
const GROUP_NAMES = ['model']

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
    const groups = new Set(GROUP_NAMES)

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.executeOnVue(context, (obj) => {
      const properties = utils.iterateProperties(obj, groups)

      for (const o of properties) {
        if (VALID_MODEL_KEYS.indexOf(o.name) === -1) {
          context.report({
            node: o.node,
            message: "Invalid key '{{name}}' in model option.",
            data: {
              name: o.name
            }
          })
        }
      }
    })
  }
}
