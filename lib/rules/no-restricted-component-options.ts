/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'
import { toRegExp } from '../utils/regexp.ts'

interface ParsedOption {
  test: Tester
  message?: string
}
interface MatchResult {
  next?: Tester
  wildcard?: boolean
  keyName: string
}
type Matcher = (name: string) => boolean
type Tester = (node: Property | SpreadElement) => MatchResult | null

function parseOption(
  option: string | string[] | { name: string | string[]; message?: string }
): ParsedOption {
  if (typeof option === 'string' || Array.isArray(option)) {
    return parseOption({
      name: option
    })
  }

  interface StepForTest {
    test: Matcher
    wildcard?: undefined
  }
  interface StepForWildcard {
    wildcard: true
    test?: undefined
  }
  type Step = StepForTest | StepForWildcard

  const steps: Step[] = []
  for (const name of Array.isArray(option.name) ? option.name : [option.name]) {
    if (name === '*') {
      steps.push({ wildcard: true })
    } else {
      const matcher = toRegExp(name, { remove: 'g' })
      steps.push({ test: (value) => matcher.test(value) })
    }
  }
  const message = option.message

  return {
    test: buildTester(0),
    message
  }

  function buildTester(index: number): Tester {
    const step = steps[index]
    const next = index + 1
    const needNext = steps.length > next
    return (node) => {
      let keyName: string
      if (step.wildcard) {
        keyName = '*'
      } else {
        if (node.type !== 'Property') {
          return null
        }
        const name = utils.getStaticPropertyName(node)
        if (!name || !step.test(name)) {
          return null
        }
        keyName = name
      }

      return {
        next: needNext ? buildTester(next) : undefined,
        wildcard: step.wildcard,
        keyName
      }
    }
  }
}

function defaultMessage(path: string[]) {
  return `Using \`${path.join('.')}\` is not allowed.`
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow specific component option',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-restricted-component-options.html'
    },
    fixable: null,
    schema: {
      type: 'array',
      items: {
        oneOf: [
          { type: 'string' },
          {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          {
            type: 'object',
            properties: {
              name: {
                oneOf: [
                  { type: 'string' },
                  {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  }
                ]
              },
              message: { type: 'string', minLength: 1 }
            },
            required: ['name'],
            additionalProperties: false
          }
        ]
      },
      uniqueItems: true,
      minItems: 0
    },

    messages: {
      // eslint-disable-next-line eslint-plugin/report-message-format
      restrictedOption: '{{message}}'
    }
  },
  create(context: RuleContext) {
    if (!context.options || context.options.length === 0) {
      return {}
    }
    const options: ParsedOption[] = context.options.map(parseOption)

    return utils.compositingVisitors(
      utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          for (const option of options) {
            verify(node, option.test, option.message)
          }
        }
      }),
      utils.defineScriptSetupVisitor(context, {
        onDefineOptionsEnter(node) {
          if (node.arguments.length === 0) return
          const define = node.arguments[0]
          if (define.type !== 'ObjectExpression') return
          for (const option of options) {
            verify(define, option.test, option.message)
          }
        }
      })
    )

    function verify(
      node: ObjectExpression,
      test: Tester,
      customMessage: string | undefined,
      path: string[] = []
    ) {
      for (const prop of node.properties) {
        const result = test(prop)
        if (!result) {
          continue
        }
        if (result.next) {
          if (
            prop.type !== 'Property' ||
            prop.value.type !== 'ObjectExpression'
          ) {
            continue
          }
          verify(prop.value, result.next, customMessage, [
            ...path,
            result.keyName
          ])
        } else {
          const message =
            customMessage || defaultMessage([...path, result.keyName])
          context.report({
            node: prop.type === 'Property' ? prop.key : prop,
            messageId: 'restrictedOption',
            data: { message }
          })
        }
      }
    }
  }
}
