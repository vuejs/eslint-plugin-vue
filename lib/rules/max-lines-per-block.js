/**
 * @author lsdsjy
 * @fileoverview Rule for checking the maximum number of lines in Vue SFC blocks.
 */
'use strict'

const { SourceCode } = require('eslint')
const utils = require('../utils')

/**
 * @param {string} text
 */
function isEmptyLine(text) {
  return !text.trim()
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'checking the maximum number of lines in Vue SFC blocks',
      categories: undefined,
      url: ''
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          style: {
            type: 'integer',
            minimum: 1
          },
          template: {
            type: 'integer',
            minimum: 1
          },
          script: {
            type: 'integer',
            minimum: 1
          },
          skipBlankLines: {
            type: 'boolean',
            minimum: 0
          }
        },
        additionalProperties: false
      }
    ]
  },
  /** @param {RuleContext} context */
  create(context) {
    const { options } = context
    const option = options[0] || {}
    /**
     * @type {Record<string, number>}
     */
    const limits = {
      template: option.template,
      script: option.script,
      style: option.style
    }

    const code = context.getSourceCode()
    const documentFragment =
      context.parserServices.getDocumentFragment &&
      context.parserServices.getDocumentFragment()

    function getTopLevelHTMLElements() {
      if (documentFragment) {
        return documentFragment.children.filter(utils.isVElement)
      }
      return []
    }

    return {
      /** @param {Program} node */
      Program(node) {
        if (utils.hasInvalidEOF(node)) {
          return
        }
        for (const block of getTopLevelHTMLElements()) {
          if (limits[block.name]) {
            // We suppose the start tag and end tag occupy one single line respectively
            let lineCount = block.loc.end.line - block.loc.start.line - 1

            if (option.skipBlankLines) {
              const lines = SourceCode.splitLines(code.getText(block))
              lineCount -= lines.filter(isEmptyLine).length
            }

            if (lineCount > limits[block.name]) {
              context.report({
                node: block,
                message: `Block has too many lines (${lineCount}). Maximum allowed is ${
                  limits[block.name]
                }.`
              })
            }
          }
        }
      }
    }
  }
}
