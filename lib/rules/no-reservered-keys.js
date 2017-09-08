/**
 * @fileoverview Prevent overwrite reserved keys
 * @author Armano
 */
'use strict'

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const RESERVED_KEYS = require('../utils/vue-reserved.json')
const GROUP_NAMES = ['props', 'computed', 'data', 'methods']

function create (context) {
  const options = context.options[0] || {}
  const reservedKeys = new Set(RESERVED_KEYS.concat(options.reserved || []))
  const groups = new Set(GROUP_NAMES.concat(options.groups || []))

  // ----------------------------------------------------------------------
  // Public
  // ----------------------------------------------------------------------

  return utils.executeOnVue(context, (obj) => {
    const properties = utils.iterateProperties(obj, groups)
    for (const o of properties) {
      if (o.groupName === 'data' && o.name[0] === '_') {
        context.report({
          node: o.node,
          message: "Keys starting with with '_' are reserved in '{{name}}' group.",
          data: {
            name: o.name
          }
        })
      } else if (reservedKeys.has(o.name)) {
        context.report({
          node: o.node,
          message: "Key '{{name}}' is reserved.",
          data: {
            name: o.name
          }
        })
      }
    }
  })
}

module.exports = {
  meta: {
    docs: {
      description: 'disallow overwriting reserved keys',
      category: 'Possible Errors',
      recommended: false,
      replacedBy: ['no-reserved-keys']
    },
    deprecated: true,
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          reserved: {
            type: 'array'
          },
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
