/**
 * @author lsdsjy
 * @fileoverview Rule for checking the maximum number of lines in Vue SFC blocks.
 */
import { SourceCode } from 'eslint'
import utils from '../utils/index.js'

function isEmptyLine(text: string) {
  return !text.trim()
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce maximum number of lines in Vue SFC blocks',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/max-lines-per-block.html'
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
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      tooManyLines:
        'Block has too many lines ({{lineCount}}). Maximum allowed is {{limit}}.'
    }
  },
  create(context: RuleContext) {
    const option = context.options[0] || {}
    const limits: Record<string, number> = {
      template: option.template,
      script: option.script,
      style: option.style
    }

    const sourceCode = context.sourceCode
    const documentFragment =
      sourceCode.parserServices.getDocumentFragment &&
      sourceCode.parserServices.getDocumentFragment()

    function getTopLevelHTMLElements() {
      return documentFragment
        ? documentFragment.children.filter(utils.isVElement)
        : []
    }

    return {
      Program(node: Program) {
        if (utils.hasInvalidEOF(node)) {
          return
        }
        for (const block of getTopLevelHTMLElements()) {
          if (!limits[block.name]) {
            continue
          }

          // We suppose the start tag and end tag occupy one single line respectively
          let lineCount = block.loc.end.line - block.loc.start.line - 1

          if (option.skipBlankLines) {
            const lines = SourceCode.splitLines(sourceCode.getText(block))
            lineCount -= lines.filter(isEmptyLine).length
          }

          if (lineCount > limits[block.name]) {
            context.report({
              node: block,
              messageId: 'tooManyLines',
              data: {
                limit: limits[block.name],
                lineCount
              }
            })
          }
        }
      }
    }
  }
}
