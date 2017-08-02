/**
 * @fileoverview Enforce consistent indentation in html template
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function create (context) {
  const indent = 2
  // ----------------------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------------------

  function checkChildIndent (node, line, column) {
    if (node.type !== 'VElement') return

    line++

    const startLoc = node.startTag.loc.start

    if (startLoc.line <= line) {
      context.report({
        node: node.startTag,
        loc: node.loc,
        message: 'Element has to be in new line.'
      })
    }

    line = startLoc.line

    if (!node.selfClosing) {
      // context.report({
      //   node,
      //   loc: node.loc,
      //   message: 'Self-closing should not be used.'
      // })

      // const endLoc = node.endTag.loc
    }
  }

  // ----------------------------------------------------------------------
  // Public
  // ----------------------------------------------------------------------

  utils.registerTemplateBodyVisitor(context, {
    'VElement[startTag.id.name="template"]' (node) {
      if (!node.selfClosing) {
        let line = node.loc.start.line
        for (const item of node.children) {
          line = checkChildIndent(item, line, 1)
        }
      }
    }
  })

  return {}
}

module.exports = {
  meta: {
    docs: {
      description: 'Enforce consistent indentation in html template',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: null,  // or "code" or "whitespace"
    schema: [
      {
        oneOf: [
          {
            enum: ['tab']
          },
          {
            type: 'integer',
            minimum: 0
          }
        ]
      }
    ]
  },

  create
}
