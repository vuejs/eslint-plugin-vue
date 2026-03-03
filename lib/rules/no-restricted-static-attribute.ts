/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'
import { toRegExp } from '../utils/regexp.ts'

interface ParsedOption {
  test: (key: VAttribute) => boolean
  useValue?: boolean
  useElement?: boolean
  message?: string
}

function parseOption(option: any): ParsedOption {
  if (typeof option === 'string') {
    const matcher = toRegExp(option, { remove: 'g' })
    return {
      test({ key }) {
        return matcher.test(key.rawName)
      }
    }
  }
  const parsed = parseOption(option.key)
  if (option.value) {
    const keyTest = parsed.test
    if (option.value === true) {
      parsed.test = (node) => {
        if (!keyTest(node)) {
          return false
        }
        return node.value == null || node.value.value === node.key.rawName
      }
    } else {
      const valueMatcher = toRegExp(option.value, { remove: 'g' })
      parsed.test = (node) => {
        if (!keyTest(node)) {
          return false
        }
        return node.value != null && valueMatcher.test(node.value.value)
      }
    }
    parsed.useValue = true
  }
  if (option.element) {
    const argTest = parsed.test
    const tagMatcher = toRegExp(option.element, { remove: 'g' })
    parsed.test = (node) => {
      if (!argTest(node)) {
        return false
      }
      const element = node.parent.parent
      return tagMatcher.test(element.rawName)
    }
    parsed.useElement = true
  }
  parsed.message = option.message
  return parsed
}

function defaultMessage(node: VAttribute, option: ParsedOption) {
  const key = node.key.rawName
  let value = ''
  if (option.useValue) {
    value = node.value == null ? '` set to `true' : `="${node.value.value}"`
  }

  let on = ''
  if (option.useElement) {
    on = ` on \`<${node.parent.parent.rawName}>\``
  }
  return `Using \`${key + value}\`${on} is not allowed.`
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow specific attribute',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-restricted-static-attribute.html'
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
              key: { type: 'string' },
              value: { oneOf: [{ type: 'string' }, { enum: [true] }] },
              element: { type: 'string' },
              message: { type: 'string', minLength: 1 }
            },
            required: ['key'],
            additionalProperties: false
          }
        ]
      },
      uniqueItems: true,
      minItems: 0
    },

    messages: {
      // eslint-disable-next-line eslint-plugin/report-message-format
      restrictedAttr: '{{message}}'
    }
  },
  create(context: RuleContext) {
    if (context.options.length === 0) {
      return {}
    }
    const options: ParsedOption[] = context.options.map(parseOption)

    return utils.defineTemplateBodyVisitor(context, {
      'VAttribute[directive=false]'(node: VAttribute) {
        for (const option of options) {
          if (option.test(node)) {
            const message = option.message || defaultMessage(node, option)
            context.report({
              node,
              messageId: 'restrictedAttr',
              data: { message }
            })
            return
          }
        }
      }
    })
  }
}
