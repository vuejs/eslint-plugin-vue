/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')
const slotAttribute = require('./syntaxes/slot-attribute')
const { getRuleOptions } = require('../utils/rule-options')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow deprecated `slot` attribute (in Vue.js 2.6.0+)',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-deprecated-slot-attribute.html'
    },
    // eslint-disable-next-line eslint-plugin/require-meta-fixable -- fixer is not recognized
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          ignore: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ],
    defaultOptions: [{ ignore: [] }],
    messages: {
      forbiddenSlotAttribute: '`slot` attributes are deprecated.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const [{ ignore }] = getRuleOptions(context, __filename)
    const templateBodyVisitor = slotAttribute.createTemplateBodyVisitor(
      context,
      ignore
    )
    return utils.defineTemplateBodyVisitor(context, templateBodyVisitor)
  }
}
