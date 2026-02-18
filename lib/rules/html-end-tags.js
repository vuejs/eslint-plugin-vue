/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const {
  defineTemplateBodyVisitor,
  hasInvalidEOF,
  isHtmlVoidElementName
} = require('../utils/index.ts')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce end tag style',
      categories: ['vue3-strongly-recommended', 'vue2-strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/html-end-tags.html'
    },
    fixable: 'code',
    schema: [],
    messages: {
      missingEndTag: "'<{{name}}>' should have end tag."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    let hasInvalidEOFInTemplate = false

    return defineTemplateBodyVisitor(
      context,
      {
        VElement(node) {
          if (hasInvalidEOFInTemplate) {
            return
          }

          const name = node.name
          const isVoid = isHtmlVoidElementName(name)
          const isSelfClosing = node.startTag.selfClosing
          const hasEndTag = node.endTag != null

          if (!isVoid && !hasEndTag && !isSelfClosing) {
            context.report({
              node: node.startTag,
              loc: node.startTag.loc,
              messageId: 'missingEndTag',
              data: { name },
              fix: (fixer) => fixer.insertTextAfter(node, `</${name}>`)
            })
          }
        }
      },
      {
        Program(node) {
          hasInvalidEOFInTemplate = hasInvalidEOF(node)
        }
      }
    )
  }
}
