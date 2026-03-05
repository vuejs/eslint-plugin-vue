/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'
import { toRegExp } from '../utils/regexp.ts'

interface ParsedOption {
  test: (block: VElement) => boolean
  message?: string
}

function parseOption(option: any): ParsedOption {
  if (typeof option === 'string') {
    const matcher = toRegExp(option, { remove: 'g' })
    return {
      test(block) {
        return matcher.test(block.rawName)
      }
    }
  }
  const parsed = parseOption(option.element)
  parsed.message = option.message
  return parsed
}

function defaultMessage(block: VElement) {
  return `Using \`<${block.rawName}>\` is not allowed.`
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow specific block',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-restricted-block.html'
    },
    fixable: null,
    schema: {
      type: 'array',
      items: {
        oneOf: [
          { type: 'string' },
          {
            type: 'object',
            properties: {
              element: { type: 'string' },
              message: { type: 'string', minLength: 1 }
            },
            required: ['element'],
            additionalProperties: false
          }
        ]
      },
      uniqueItems: true,
      minItems: 0
    },

    messages: {
      // eslint-disable-next-line eslint-plugin/report-message-format
      restrictedBlock: '{{message}}'
    }
  },
  create(context: RuleContext) {
    const options: ParsedOption[] = context.options.map(parseOption)

    const sourceCode = context.sourceCode
    const documentFragment =
      sourceCode.parserServices.getDocumentFragment &&
      sourceCode.parserServices.getDocumentFragment()

    function getTopLevelHTMLElements() {
      if (documentFragment) {
        return documentFragment.children.filter(utils.isVElement)
      }
      return []
    }

    return {
      Program(node: Program) {
        if (utils.hasInvalidEOF(node)) {
          return
        }
        for (const block of getTopLevelHTMLElements()) {
          for (const option of options) {
            if (option.test(block)) {
              const message = option.message || defaultMessage(block)
              context.report({
                node: block.startTag,
                messageId: 'restrictedBlock',
                data: { message }
              })
              break
            }
          }
        }
      }
    }
  }
}
