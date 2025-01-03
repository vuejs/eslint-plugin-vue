/**
 * @fileoverview Requires specific casing for the Prop name in Vue components
 * @author Yu Kimura
 */
'use strict'

const utils = require('../utils')
const casing = require('../utils/casing')
const { getRuleOptions } = require('../utils/rule-options')

/**
 * @typedef {import('../utils').ComponentProp} ComponentProp
 */

/** @param {RuleContext} context */
function create(context) {
  const [caseType] = getRuleOptions(context, __filename)
  const checker = casing.getChecker(caseType)

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
          messageId: 'invalidCase',
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

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce specific casing for the Prop name in Vue components',
      categories: ['vue3-strongly-recommended', 'vue2-strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/prop-name-casing.html'
    },
    fixable: null, // null or "code" or "whitespace"
    schema: [
      {
        enum: ['camelCase', 'snake_case']
      }
    ],
    defaultOptions: ['camelCase'],
    messages: {
      invalidCase: 'Prop "{{name}}" is not in {{caseType}}.'
    }
  },
  create
}
