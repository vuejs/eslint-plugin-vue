/**
 * @fileoverview Prevents duplication of field names.
 * @author Armano
 */
'use strict'

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const GROUP_NAMES = ['props', 'computed', 'data', 'methods']

function create (context) {
  const options = context.options[0] || {}
  const groups = new Set(GROUP_NAMES.concat(options.groups || []))

  // ----------------------------------------------------------------------
  // Public
  // ----------------------------------------------------------------------

  return utils.executeOnVue(context, (obj) => {
    const usedNames = []
    const properties = utils.iterateProperties(obj, groups)

    for (const o of properties) {
      if (usedNames.indexOf(o.name) !== -1) {
        context.report({
          node: o.node,
          message: "Duplicated key '{{name}}'.",
          data: {
            name: o.name
          }
        })
      }

      usedNames.push(o.name)
    }
  })
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'disallow duplication of field names',
      category: 'essential'
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

  create
}
