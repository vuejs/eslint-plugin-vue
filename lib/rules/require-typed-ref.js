/**
 * @author Ivan Demchuk <https://github.com/Demivan>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const {
  iterateDefineRefs
} = require('../utils/ref-object-references')
const utils = require('../utils')

/**
 * @typedef {import('../utils/ref-object-references').RefObjectReferences} RefObjectReferences
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce declaration style of `defineProps`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/define-props-declaration.html'
    },
    fixable: null,
    messages: {
      noType: 'Specify type parameter for `ref`, otherwise it will be `any`.'
    },
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    const scriptSetup = utils.getScriptSetupElement(context)
    if (scriptSetup && !utils.hasAttribute(scriptSetup, 'lang', 'ts')) {
      return {}
    }

    const defines = iterateDefineRefs(context.getScope())

    return {
      Program() {
        for (const ref of defines) {
          if (ref.node.parent.type !== 'VariableDeclarator' || ref.node.parent.id.type !== 'Identifier') {
            continue
          }

          if (ref.node.arguments.length > 0) {
            continue
          }

          if (ref.node.typeParameters == null && ref.node.parent.id.typeAnnotation == null) {
            context.report({
              node: ref.node,
              messageId: 'noType',
            })
          }
        }
      },
    }
  }
}
