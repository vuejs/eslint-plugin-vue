/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */

import utils from '../utils/index.js'
import scopeAttribute from './syntaxes/scope-attribute.js'

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow deprecated `scope` attribute (in Vue.js 2.5.0+)',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-deprecated-scope-attribute.html'
    },
    // eslint-disable-next-line eslint-plugin/require-meta-fixable -- fixer is not recognized
    fixable: 'code',
    schema: [],
    messages: {
      forbiddenScopeAttribute: '`scope` attributes are deprecated.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const templateBodyVisitor =
      scopeAttribute.createTemplateBodyVisitor(context)
    return utils.defineTemplateBodyVisitor(context, templateBodyVisitor)
  }
}
