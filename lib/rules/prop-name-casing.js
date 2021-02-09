/**
 * @fileoverview Requires specific casing for the Prop name in Vue components
 * @author Yu Kimura
 */
'use strict'

const utils = require('../utils')
const casing = require('../utils/casing')
const ALLOWED_CASE_OPTIONS = ['camelCase', 'snake_case']

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
/** @param {RuleContext} context */
function create(context) {
  const options = context.options[0]
  const ignores = (context.options[1] && context.options[1].ignores) || []

  const caseType =
    ALLOWED_CASE_OPTIONS.indexOf(options) !== -1 ? options : 'camelCase'
  const checker = casing.getChecker(caseType)

  // ----------------------------------------------------------------------
  // Public
  // ----------------------------------------------------------------------

  return utils.executeOnVue(context, (obj) => {
    for (const item of utils.getComponentProps(obj)) {
      const propName = item.propName
      if (propName == null || ignores.some((pattern) => propName.match(pattern))) {
        continue
      }
      if (!checker(propName)) {
        context.report({
          node: item.node,
          message: 'Prop "{{name}}" is not in {{caseType}}.',
          data: {
            name: propName,
            caseType
          }
        })
      }
    }
  })
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
const OBJECT_OPTION_SCHEMA = {
  type: 'object',
  properties: {
    ignores: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false
    }
  },
  additionalProperties: false
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce specific casing for the Prop name in Vue components',
      categories: ['vue3-strongly-recommended', 'strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/prop-name-casing.html'
    },
    fixable: null, // null or "code" or "whitespace"
    schema: {
      anyOf: [
        {
          type: 'array',
          items: [
            {
              enum: ALLOWED_CASE_OPTIONS
            },
            OBJECT_OPTION_SCHEMA
          ]
        },
        // For backward compatibility
        {
          enum: ALLOWED_CASE_OPTIONS
        }
      ]
    }
  },
  create
}
