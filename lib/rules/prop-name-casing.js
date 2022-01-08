/**
 * @fileoverview Requires specific casing for the Prop name in Vue components
 * @author Yu Kimura
 */
'use strict'

const utils = require('../utils')
const casing = require('../utils/casing')
const allowedCaseOptions = ['camelCase', 'snake_case']

/**
 * @typedef {import('../utils').ComponentProp} ComponentProp
 */

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
/** @param {RuleContext} context */
function create(context) {
  const options = context.options[0]
  const caseType =
    allowedCaseOptions.indexOf(options) !== -1 ? options : 'camelCase'
  const checker = casing.getChecker(caseType)

  // ----------------------------------------------------------------------
  // Public
  // ----------------------------------------------------------------------

  /**
   * @param {ComponentProp[]} props
   */
  function processProps(props) {
    for (const item of props) {
      const propName = item.propName
      if (propName == null) {
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
  }
  return utils.compositingVisitors(
    utils.defineScriptSetupVisitor(context, {
      onDefinePropsEnter(_node, props) {
        processProps(props)
      }
    }),
    utils.executeOnVue(context, (obj) => {
      processProps(utils.getComponentPropsFromOptions(obj))
    })
  )
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

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
    schema: [
      {
        enum: allowedCaseOptions
      }
    ]
  },
  create
}
