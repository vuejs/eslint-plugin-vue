/**
 * @author ItMaga <https://github.com/ItMaga>
 * See LICENSE file in root directory for full license.
 */
import type { ComponentEmit, ComponentProp } from '../utils/index.ts'
import utils from '../utils/index.ts'
import { isCommentToken } from '@eslint-community/eslint-utils'

const AvailablePaddingOptions = {
  Never: 'never',
  Always: 'always',
  Ignore: 'ignore'
}
const OptionKeys = {
  BetweenOptions: 'betweenOptions',
  WithinOption: 'withinOption',
  BetweenItems: 'betweenItems',
  WithinEach: 'withinEach',
  GroupSingleLineProperties: 'groupSingleLineProperties'
}

function isComma(node: Token) {
  return node.type === 'Punctuator' && node.value === ','
}

type ValidComponentPropOrEmit = Exclude<
  ComponentProp | ComponentEmit,
  { type: 'infer-type' }
> & { node: { type: 'Property' | 'SpreadElement' } }

function isValidProperties<T extends ComponentProp | ComponentEmit>(
  propOrEmit: T
): propOrEmit is ValidComponentPropOrEmit & T {
  return Boolean(
    propOrEmit.type !== 'infer-type' &&
    propOrEmit.node &&
    ['Property', 'SpreadElement'].includes(propOrEmit.node.type)
  )
}

/**
 * Split the source code into multiple lines based on the line delimiters.
 */
function splitLines(text: string): string[] {
  return text.split(/\r\n|[\r\n\u{2028}\u{2029}]/gu)
}

function parseOption(initialOption: any, optionKey: string) {
  return typeof initialOption === 'string'
    ? initialOption
    : initialOption[optionKey]
}

function parseBooleanOption(initialOption: any, optionKey: string) {
  if (typeof initialOption === 'string') {
    if (initialOption === AvailablePaddingOptions.Always) return true
    if (initialOption === AvailablePaddingOptions.Never) return false
  }
  return initialOption[optionKey]
}

function shouldGroupSingleLineProperties(
  currentProperty: Property | SpreadElement,
  nextProperty: Property | SpreadElement,
  isGroupingEnabled: boolean
): boolean {
  const isSingleCurrentProperty = utils.isSingleLine(currentProperty)
  const isSingleNextProperty = utils.isSingleLine(nextProperty)

  return isSingleCurrentProperty && isSingleNextProperty && isGroupingEnabled
}

export default {
  meta: {
    type: 'layout',
    docs: {
      description: 'require or disallow padding lines in component definition',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/padding-lines-in-component-definition.html'
    },
    fixable: 'whitespace',
    schema: [
      {
        oneOf: [
          {
            enum: [
              AvailablePaddingOptions.Always,
              AvailablePaddingOptions.Never
            ]
          },
          {
            type: 'object',
            additionalProperties: false,
            properties: {
              [OptionKeys.BetweenOptions]: {
                enum: Object.values(AvailablePaddingOptions)
              },
              [OptionKeys.WithinOption]: {
                oneOf: [
                  {
                    enum: Object.values(AvailablePaddingOptions)
                  },
                  {
                    type: 'object',
                    patternProperties: {
                      '^[a-zA-Z]*$': {
                        oneOf: [
                          {
                            enum: Object.values(AvailablePaddingOptions)
                          },
                          {
                            type: 'object',
                            properties: {
                              [OptionKeys.BetweenItems]: {
                                enum: Object.values(AvailablePaddingOptions)
                              },
                              [OptionKeys.WithinEach]: {
                                enum: Object.values(AvailablePaddingOptions)
                              }
                            },
                            additionalProperties: false
                          }
                        ]
                      }
                    },
                    minProperties: 1,
                    additionalProperties: false
                  }
                ]
              },
              [OptionKeys.GroupSingleLineProperties]: {
                type: 'boolean'
              }
            }
          }
        ]
      }
    ],
    messages: {
      never: 'Unexpected blank line before this definition.',
      always: 'Expected blank line before this definition.',
      groupSingleLineProperties:
        'Unexpected blank line between single line properties.'
    }
  },
  create(context: RuleContext) {
    const options = context.options[0] || AvailablePaddingOptions.Always
    const sourceCode = context.sourceCode

    function replaceLines(
      currentProperty: Property | SpreadElement,
      nextProperty: Property | SpreadElement | Token,
      fixer: RuleFixer
    ) {
      const commaToken = sourceCode.getTokenAfter(currentProperty, isComma)

      const start = (commaToken || currentProperty).range[1]
      const end = nextProperty.range[0]

      const paddingText = sourceCode.text.slice(start, end)
      const newText = `\n${splitLines(paddingText).pop()}`

      return fixer.replaceTextRange([start, end], newText)
    }

    function insertLines(
      currentProperty: Property | SpreadElement,
      nextProperty: Property | SpreadElement | Token,
      fixer: RuleFixer,
      betweenLinesRange: number
    ) {
      const commaToken = sourceCode.getTokenAfter(currentProperty, isComma)

      const lineBeforeNextProperty =
        sourceCode.lines[nextProperty.loc.start.line - 1]
      const lastSpaces = /^\s*/.exec(lineBeforeNextProperty)![0]

      const newText = betweenLinesRange === 0 ? `\n\n${lastSpaces}` : '\n'
      return fixer.insertTextAfter(commaToken || currentProperty, newText)
    }

    function verify(
      properties: (Property | SpreadElement)[],
      option: any,
      nextOption: any
    ) {
      const groupSingleLineProperties = parseBooleanOption(
        options,
        OptionKeys.GroupSingleLineProperties
      )

      for (const [i, currentProperty] of properties.entries()) {
        const nextProperty = properties[i + 1]

        if (nextProperty && option !== AvailablePaddingOptions.Ignore) {
          const tokenBeforeNext = sourceCode.getTokenBefore(nextProperty, {
            includeComments: true
          })
          const isCommentBefore = isCommentToken(tokenBeforeNext)
          const reportNode = isCommentBefore ? tokenBeforeNext : nextProperty

          const betweenLinesRange =
            reportNode.loc.start.line - currentProperty.loc.end.line

          if (
            shouldGroupSingleLineProperties(
              currentProperty,
              nextProperty,
              groupSingleLineProperties
            )
          ) {
            if (betweenLinesRange > 1) {
              context.report({
                node: reportNode,
                messageId: 'groupSingleLineProperties',
                loc: reportNode.loc,
                fix(fixer) {
                  return replaceLines(currentProperty, reportNode, fixer)
                }
              })
            }
            continue
          }

          if (
            betweenLinesRange <= 1 &&
            option === AvailablePaddingOptions.Always
          ) {
            context.report({
              node: reportNode,
              messageId: 'always',
              loc: reportNode.loc,
              fix(fixer) {
                return insertLines(
                  currentProperty,
                  reportNode,
                  fixer,
                  betweenLinesRange
                )
              }
            })
          } else if (
            betweenLinesRange > 1 &&
            option === AvailablePaddingOptions.Never
          ) {
            context.report({
              node: reportNode,
              messageId: 'never',
              loc: reportNode.loc,
              fix(fixer) {
                return replaceLines(currentProperty, reportNode, fixer)
              }
            })
          }
        }

        if (!nextOption) continue

        const name =
          currentProperty.type === 'Property' &&
          utils.getStaticPropertyName(currentProperty)
        if (!name) continue

        const propertyOption = parseOption(nextOption, name)
        if (!propertyOption) continue

        const nestedProperties =
          currentProperty.type === 'Property' &&
          currentProperty.value.type === 'ObjectExpression' &&
          currentProperty.value.properties
        if (!nestedProperties) continue

        verify(
          nestedProperties,
          parseOption(propertyOption, OptionKeys.BetweenItems),
          parseOption(propertyOption, OptionKeys.WithinEach)
        )
      }
    }

    return utils.compositingVisitors(
      utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          verify(
            node.properties,
            parseOption(options, OptionKeys.BetweenOptions),
            parseOption(options, OptionKeys.WithinOption)
          )
        }
      }),
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(_, props) {
          const propNodes = props
            .filter(isValidProperties)
            .map((prop) => prop.node)

          const withinOption = parseOption(options, OptionKeys.WithinOption)
          const propsOption = withinOption && parseOption(withinOption, 'props')
          if (!propsOption) return

          verify(
            propNodes,
            parseOption(propsOption, OptionKeys.BetweenItems),
            parseOption(propsOption, OptionKeys.WithinEach)
          )
        },
        onDefineEmitsEnter(_, emits) {
          const emitNodes = emits
            .filter(isValidProperties)
            .map((emit) => emit.node)

          const withinOption = parseOption(options, OptionKeys.WithinOption)
          const emitsOption = withinOption && parseOption(withinOption, 'emits')
          if (!emitsOption) return

          verify(
            emitNodes,
            parseOption(emitsOption, OptionKeys.BetweenItems),
            parseOption(emitsOption, OptionKeys.WithinEach)
          )
        },
        onDefineOptionsEnter(node) {
          if (node.arguments.length === 0) return
          const define = node.arguments[0]
          if (define.type !== 'ObjectExpression') return
          verify(
            define.properties,
            parseOption(options, OptionKeys.BetweenOptions),
            parseOption(options, OptionKeys.WithinOption)
          )
        }
      })
    )
  }
}
