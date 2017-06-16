/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Creates AST event handlers for no-invalid-template-root.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create (context) {
  const sourceCode = context.getSourceCode()

  return {
    Program (program) {
      const node = program.templateBody
      if (node == null) {
        return
      }

      const rootElements = []
      let extraText = null
      let extraElement = null
      let vIf = false
      for (const child of node.children) {
        if (child.type === 'VElement') {
          if (rootElements.length === 0) {
            rootElements.push(child)
            vIf = utils.hasDirective(child.startTag, 'if')
          } else if (vIf && utils.hasDirective(child.startTag, 'else-if')) {
            rootElements.push(child)
          } else if (vIf && utils.hasDirective(child.startTag, 'else')) {
            rootElements.push(child)
            vIf = false
          } else {
            extraElement = child
          }
        } else if (sourceCode.getText(child).trim() !== '') {
          extraText = child
        }
      }

      if (extraText != null) {
        context.report({
          node: extraText,
          loc: extraText.loc,
          message: 'The template root requires an element rather than texts.'
        })
      } else if (extraElement != null) {
        context.report({
          node: extraElement,
          loc: extraElement.loc,
          message: 'The template root requires exactly one element.'
        })
      } else if (rootElements.length === 0) {
        context.report({
          node,
          loc: node.loc,
          message: 'The template root requires exactly one element.'
        })
      } else {
        for (const element of rootElements) {
          const tag = element.startTag
          const name = tag.id.name

          if (name === 'template' || name === 'slot') {
            context.report({
              node: tag,
              loc: tag.loc,
              message: "The template root disallows '<{{name}}>' elements.",
              data: { name }
            })
          }
          if (utils.hasDirective(tag, 'for')) {
            context.report({
              node: tag,
              loc: tag.loc,
              message: "The template root disallows 'v-for' directives."
            })
          }
        }
        if (vIf) {
          const tag = rootElements[0].startTag
          context.report({
            node: tag,
            loc: tag.loc,
            message: "The template root requires the next element which has 'v-else' directives if it has 'v-if' directives."
          })
        }
      }
    }
  }
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create,
  meta: {
    docs: {
      description: 'disallow invalid template root.',
      category: 'Possible Errors',
      recommended: true
    },
    fixable: false,
    schema: []
  }
}
