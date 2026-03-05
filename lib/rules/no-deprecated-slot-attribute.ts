/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'
import slotAttribute from './syntaxes/slot-attribute.ts'

export default {
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
          },
          ignoreParents: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      forbiddenSlotAttribute: '`slot` attributes are deprecated.'
    }
  },
  create(context: RuleContext) {
    const templateBodyVisitor = slotAttribute.createTemplateBodyVisitor(context)
    return utils.defineTemplateBodyVisitor(context, templateBodyVisitor)
  }
}
