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
 */
function getDirectivesLength(rootElements) {
  let ifLength = 0
  let elseLength = 0
  let elseIfLength = 0

  for (const element of rootElements) {
    if (element.type === 'VElement') {
      if (utils.hasDirective(element, 'if')) ifLength += 1
      if (utils.hasDirective(element, 'else')) elseLength += 1
      if (utils.hasDirective(element, 'else-if')) elseIfLength += 1
    }
  }

  return {
    ifLength,
    elseLength,
    elseIfLength
  }
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce valid `v-if` directives on root element',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-root-v-if.html'
    },
    fixable: null,
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    return {
      /** @param {Program} program */
      Program(program) {
        const element = program.templateBody
        if (element == null) {
          return
        }

        const rootElements = element.children.filter(utils.isVElement)
        if (rootElements.length === 0) return
        const { ifLength, elseLength, elseIfLength } =
          getDirectivesLength(rootElements)
        if (ifLength === 1 && elseLength === 0 && elseIfLength === 0) {
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
