/**
 * @author Perry Song
 * @copyright 2023 Perry Song. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

/**
 * Get the number of root element directive
 * @param {VNode[]} rootElements The start tag node to check.
 * @param {string} directiveName The directive name to check.
 */
function getDirectiveLength(rootElements, directiveName) {
  if (!directiveName) return 0
  return rootElements.filter(
    (element) =>
      element.type === 'VElement' && utils.hasDirective(element, directiveName)
  ).length
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce valid `v-if` directives on root element',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/valid-v-if-template-root.html'
    },
    fixable: null,
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    const sourceCode = context.getSourceCode()

    return {
      /** @param {Program} program */
      Program(program) {
        const element = program.templateBody
        if (element == null) {
          return
        }

        const rootElements = []
        for (const child of element.children) {
          if (sourceCode.getText(child).trim() !== '') {
            rootElements.push(child)
          }
        }

        if (rootElements.length === 0) return
        const hasRootVIfLength = getDirectiveLength(rootElements, 'if')
        const hasRootVElseLength = getDirectiveLength(rootElements, 'else')
        const hasRootVElseIfLength = getDirectiveLength(rootElements, 'else-if')
        if (
          hasRootVIfLength === 1 &&
          hasRootVElseLength === 0 &&
          hasRootVElseIfLength === 0
        ) {
          context.report({
            node: element,
            loc: element.loc,
            message:
              '`v-if` should not be used on root element without `v-else`.'
          })
        }
      }
    }
  }
}
