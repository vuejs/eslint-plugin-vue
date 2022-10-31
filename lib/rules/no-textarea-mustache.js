/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow mustaches in `<textarea>`',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/no-textarea-mustache.html'
    },
    fixable: null,
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    const sourceCode = context.getSourceCode()

    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VExpressionContainer} node */
      "VElement[name='textarea'] VExpressionContainer"(node) {
        if (node.parent.type !== 'VElement') {
          return
        }

        const parentStartTag = sourceCode.getText(node.parent.startTag)

        if (parentStartTag.startsWith('<T')) {
          return
        }

        context.report({
          node,
          loc: node.loc,
          message: "Unexpected mustache. Use 'v-model' instead."
        })
      }
    })
  }
}
