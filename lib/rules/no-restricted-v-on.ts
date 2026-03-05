/**
 * @author Kamogelo Moalusi <github.com/thesheppard>
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'
import { toRegExp } from '../utils/regexp.ts'

interface ParsedOption {
  test: (key: VDirectiveKey) => boolean
  modifiers?: string[]
  useElement?: boolean
  message?: string
}

function parseOption(option: any): ParsedOption {
  if (typeof option === 'string') {
    const matcher = toRegExp(option, { remove: 'g' })
    return {
      test(key) {
        return Boolean(
          key.argument &&
          key.argument.type === 'VIdentifier' &&
          matcher.test(key.argument.rawName)
        )
      }
    }
  }
  if (option === null) {
    return {
      test(key) {
        return key.argument === null
      }
    }
  }
  const parsed = parseOption(option.argument)

  if (option.modifiers) {
    const argTest = parsed.test
    parsed.test = (key) => {
      if (!argTest(key)) {
        return false
      }
      return (option.modifiers as string[]).every((modName) =>
        key.modifiers.some((mid) => mid.name === modName)
      )
    }
    parsed.modifiers = option.modifiers
  }
  if (option.element) {
    const argTest = parsed.test
    const tagMatcher = toRegExp(option.element, { remove: 'g' })
    parsed.test = (key) => {
      if (!argTest(key)) {
        return false
      }
      return tagMatcher.test(key.parent.parent.parent.rawName)
    }
    parsed.useElement = true
  }
  parsed.message = option.message
  return parsed
}

function defaultMessage(key: VDirectiveKey, option: ParsedOption) {
  const von = key.name.rawName === '@' ? '' : 'v-on'
  const arg =
    key.argument != null && key.argument.type === 'VIdentifier'
      ? `${key.name.rawName === '@' ? '@' : ':'}${key.argument.rawName}`
      : ''
  const mod =
    option.modifiers != null && option.modifiers.length > 0
      ? `.${option.modifiers.join('.')}`
      : ''
  let element = 'element'
  if (option.useElement) {
    element = `<${key.parent.parent.parent.rawName}>`
  }
  return `Using \`${von + arg + mod}\` is not allowed on this ${element}.`
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow specific argument in `v-on`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-restricted-v-on.html'
    },
    fixable: null,
    schema: {
      type: 'array',
      items: {
        oneOf: [
          { type: ['string', 'null'] },
          {
            type: 'object',
            properties: {
              argument: { type: ['string', 'null'] },
              element: { type: 'string' },
              message: { type: 'string', minLength: 1 },
              modifiers: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: [
                    'prevent',
                    'stop',
                    'capture',
                    'self',
                    'once',
                    'passive'
                  ]
                },
                uniqueItems: true,
                minItems: 1
              }
            },
            required: ['argument'],
            additionalProperties: false
          }
        ]
      },
      uniqueItems: true
    },
    messages: {
      // eslint-disable-next-line eslint-plugin/report-message-format
      restrictedVOn: '{{message}}'
    }
  },

  create(context: RuleContext) {
    if (context.options.length === 0) {
      return {}
    }
    const options: ParsedOption[] = context.options.map(parseOption)

    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='on'] > VDirectiveKey"(
        node: VDirectiveKey
      ) {
        for (const option of options) {
          if (option.test(node)) {
            const message = option.message || defaultMessage(node, option)
            context.report({
              node,
              messageId: 'restrictedVOn',
              data: { message }
            })
            return
          }
        }
      }
    })
  }
}
