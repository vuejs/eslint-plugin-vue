/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import { findVariable } from '@eslint-community/eslint-utils'
import utils from '../utils/index.js'
import { toRegExp } from '../utils/regexp.ts'

interface ParsedOption {
  test: (name: string) => boolean
  message?: string
  suggest?: string
}

function parseOption(
  option: string | { event: string; message?: string; suggest?: string }
): ParsedOption {
  if (typeof option === 'string') {
    const matcher = toRegExp(option, { remove: 'g' })
    return {
      test(name) {
        return matcher.test(name)
      }
    }
  }
  const parsed = parseOption(option.event)
  parsed.message = option.message
  parsed.suggest = option.suggest
  return parsed
}

interface NameWithLoc {
  name: string
  loc: SourceLocation
  range: Range
}
/**
 * Get the name param node from the given CallExpression
 */
function getNameParamNode(node: CallExpression): NameWithLoc | null {
  const nameLiteralNode = node.arguments[0]
  if (nameLiteralNode && utils.isStringLiteral(nameLiteralNode)) {
    const name = utils.getStringLiteralValue(nameLiteralNode)
    if (name != null) {
      return { name, loc: nameLiteralNode.loc, range: nameLiteralNode.range }
    }
  }

  // cannot check
  return null
}
/**
 * Get the callee member node from the given CallExpression
 */
function getCalleeMemberNode(node: CallExpression) {
  const callee = utils.skipChainExpression(node.callee)

  if (callee.type === 'MemberExpression') {
    const name = utils.getStaticPropertyName(callee)
    if (name) {
      return { name, member: callee }
    }
  }
  return null
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow specific custom event',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-restricted-custom-event.html'
    },
    fixable: null,
    hasSuggestions: true,
    schema: {
      type: 'array',
      items: {
        oneOf: [
          { type: ['string'] },
          {
            type: 'object',
            properties: {
              event: { type: 'string' },
              message: { type: 'string', minLength: 1 },
              suggest: { type: 'string' }
            },
            required: ['event'],
            additionalProperties: false
          }
        ]
      },
      uniqueItems: true,
      minItems: 0
    },

    messages: {
      // eslint-disable-next-line eslint-plugin/report-message-format
      restrictedEvent: '{{message}}',
      instead: 'Instead, change to `{{suggest}}`.'
    }
  },
  create(context: RuleContext) {
    const setupContexts = new Map<
      ObjectExpression,
      {
        contextReferenceIds: Set<Identifier>
        emitReferenceIds: Set<Identifier>
      }
    >()
    const options: ParsedOption[] = context.options.map(parseOption)

    function verify(nameWithLoc: NameWithLoc) {
      const name = nameWithLoc.name

      for (const option of options) {
        if (option.test(name)) {
          const message =
            option.message || `Using \`${name}\` event is not allowed.`
          context.report({
            loc: nameWithLoc.loc,
            messageId: 'restrictedEvent',
            data: { message },
            suggest: option.suggest
              ? [
                  {
                    fix(fixer) {
                      const sourceCode = context.sourceCode
                      return fixer.replaceTextRange(
                        nameWithLoc.range,
                        `${
                          sourceCode.text[nameWithLoc.range[0]]
                        }${JSON.stringify(option.suggest)
                          .slice(1, -1)
                          .replaceAll("'", String.raw`\'`)}${
                          sourceCode.text[nameWithLoc.range[1] - 1]
                        }`
                      )
                    },
                    messageId: 'instead',
                    data: { suggest: option.suggest }
                  }
                ]
              : []
          })
          break
        }
      }
    }

    return utils.defineTemplateBodyVisitor(
      context,
      {
        CallExpression(node) {
          const callee = node.callee
          const nameWithLoc = getNameParamNode(node)
          if (!nameWithLoc) {
            // cannot check
            return
          }
          if (callee.type === 'Identifier' && callee.name === '$emit') {
            verify(nameWithLoc)
          }
        }
      },
      utils.compositingVisitors(
        utils.defineVueVisitor(context, {
          onSetupFunctionEnter(node, { node: vueNode }) {
            const contextParam = utils.skipDefaultParamValue(node.params[1])
            if (!contextParam) {
              // no arguments
              return
            }
            if (
              contextParam.type === 'RestElement' ||
              contextParam.type === 'ArrayPattern'
            ) {
              // cannot check
              return
            }
            const contextReferenceIds = new Set<Identifier>()
            const emitReferenceIds = new Set<Identifier>()
            if (contextParam.type === 'ObjectPattern') {
              const emitProperty = utils.findAssignmentProperty(
                contextParam,
                'emit'
              )
              if (!emitProperty || emitProperty.value.type !== 'Identifier') {
                return
              }
              const emitParam = emitProperty.value
              // `setup(props, {emit})`
              const variable = findVariable(
                utils.getScope(context, emitParam),
                emitParam
              )
              if (!variable) {
                return
              }
              for (const reference of variable.references) {
                emitReferenceIds.add(reference.identifier)
              }
            } else {
              // `setup(props, context)`
              const variable = findVariable(
                utils.getScope(context, contextParam),
                contextParam
              )
              if (!variable) {
                return
              }
              for (const reference of variable.references) {
                contextReferenceIds.add(reference.identifier)
              }
            }
            setupContexts.set(vueNode, {
              contextReferenceIds,
              emitReferenceIds
            })
          },
          CallExpression(node, { node: vueNode }) {
            const nameWithLoc = getNameParamNode(node)
            if (!nameWithLoc) {
              // cannot check
              return
            }

            // verify setup context
            const setupContext = setupContexts.get(vueNode)
            if (setupContext) {
              const { contextReferenceIds, emitReferenceIds } = setupContext
              if (
                node.callee.type === 'Identifier' &&
                emitReferenceIds.has(node.callee)
              ) {
                // verify setup(props,{emit}) {emit()}
                verify(nameWithLoc)
              } else {
                const emit = getCalleeMemberNode(node)
                if (
                  emit &&
                  emit.name === 'emit' &&
                  emit.member.object.type === 'Identifier' &&
                  contextReferenceIds.has(emit.member.object)
                ) {
                  // verify setup(props,context) {context.emit()}
                  verify(nameWithLoc)
                }
              }
            }
          },
          onVueObjectExit(node) {
            setupContexts.delete(node)
          }
        }),
        {
          CallExpression(node) {
            const nameWithLoc = getNameParamNode(node)
            if (!nameWithLoc) {
              // cannot check
              return
            }
            const emit = getCalleeMemberNode(node)
            // verify $emit
            if (emit && emit.name === '$emit') {
              // verify this.$emit()
              verify(nameWithLoc)
            }
          }
        }
      )
    )
  }
}
