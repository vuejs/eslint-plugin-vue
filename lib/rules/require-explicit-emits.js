/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

/**
 * @typedef {import('../utils').ComponentArrayEmit} ComponentArrayEmit
 * @typedef {import('../utils').ComponentObjectEmit} ComponentObjectEmit
 * @typedef {import('../utils').VueObjectData} VueObjectData
 */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const { findVariable } = require('eslint-utils')
const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

const FIX_EMITS_AFTER_OPTIONS = [
  'setup',
  'data',
  'computed',
  'watch',
  'methods',
  'template',
  'render',
  'renderError',

  // lifecycle hooks
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'activated',
  'deactivated',
  'beforeUnmount',
  'unmounted',
  'beforeDestroy',
  'destroyed',
  'renderTracked',
  'renderTriggered',
  'errorCaptured'
]

/**
 * Check whether the given token is a left brace.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a left brace.
 */
function isLeftBrace(token) {
  return token != null && token.type === 'Punctuator' && token.value === '{'
}

/**
 * Check whether the given token is a right brace.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a right brace.
 */
function isRightBrace(token) {
  return token != null && token.type === 'Punctuator' && token.value === '}'
}

/**
 * Check whether the given token is a left bracket.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a left bracket.
 */
function isLeftBracket(token) {
  return token != null && token.type === 'Punctuator' && token.value === '['
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require `emits` option with name triggered by `$emit()`',
      categories: ['vue3-strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/require-explicit-emits.html'
    },
    fixable: null,
    schema: [],
    messages: {
      missing:
        'The "{{name}}" event has been triggered but not declared on `emits` option.',
      addOneOption: 'Add the "{{name}}" to `emits` option.',
      addArrayEmitsOption:
        'Add the `emits` option with array syntax and define "{{name}}" event.',
      addObjectEmitsOption:
        'Add the `emits` option with object syntax and define "{{name}}" event.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @typedef { { node: Literal, name: string } } EmitCellName */
    /** @type {Map<ObjectExpression, { contextReferenceIds: Set<Identifier>, emitReferenceIds: Set<Identifier> }>} */
    const setupContexts = new Map()
    /** @type {Map<ObjectExpression, (ComponentArrayEmit | ComponentObjectEmit)[]>} */
    const vueEmitsDeclarations = new Map()

    /** @type {EmitCellName[]} */
    const templateEmitCellNames = []
    /** @type { { type: 'export' | 'mark' | 'definition', object: ObjectExpression, emits: (ComponentArrayEmit | ComponentObjectEmit)[] } | null } */
    let vueObjectData = null

    /**
     * @param {Literal} nameLiteralNode
     */
    function addTemplateEmitCellName(nameLiteralNode) {
      templateEmitCellNames.push({
        node: nameLiteralNode,
        name: `${nameLiteralNode.value}`
      })
    }

    /**
     * @param {(ComponentArrayEmit | ComponentObjectEmit)[]} emitsDeclarations
     * @param {Literal} nameLiteralNode
     * @param {ObjectExpression} vueObjectNode
     */
    function verify(emitsDeclarations, nameLiteralNode, vueObjectNode) {
      const name = `${nameLiteralNode.value}`
      if (emitsDeclarations.some((e) => e.emitName === name)) {
        return
      }
      context.report({
        node: nameLiteralNode,
        messageId: 'missing',
        data: {
          name
        },
        suggest: buildSuggest(
          vueObjectNode,
          emitsDeclarations,
          nameLiteralNode,
          context
        )
      })
    }

    return utils.defineTemplateBodyVisitor(
      context,
      {
        /** @param { CallExpression & { argument: [Literal, ...Expression] } } node */
        'CallExpression[arguments.0.type=Literal]'(node) {
          const callee = node.callee
          const nameLiteralNode = /** @type {Literal} */ (node.arguments[0])
          if (!nameLiteralNode || typeof nameLiteralNode.value !== 'string') {
            // cannot check
            return
          }
          if (callee.type === 'Identifier' && callee.name === '$emit') {
            addTemplateEmitCellName(nameLiteralNode)
          }
        },
        "VElement[parent.type!='VElement']:exit"() {
          if (!vueObjectData) {
            return
          }
          const emitsDeclarationNames = new Set(
            vueObjectData.emits.map((e) => e.emitName)
          )

          for (const { name, node } of templateEmitCellNames) {
            if (emitsDeclarationNames.has(name)) {
              continue
            }
            context.report({
              node,
              messageId: 'missing',
              data: {
                name
              },
              suggest: buildSuggest(
                vueObjectData.object,
                vueObjectData.emits,
                node,
                context
              )
            })
          }
        }
      },
      utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          vueEmitsDeclarations.set(node, utils.getComponentEmits(node))
        },
        onSetupFunctionEnter(node, { node: vueNode }) {
          const contextParam = node.params[1]
          if (!contextParam) {
            // no arguments
            return
          }
          if (contextParam.type === 'RestElement') {
            // cannot check
            return
          }
          if (contextParam.type === 'ArrayPattern') {
            // cannot check
            return
          }
          /** @type {Set<Identifier>} */
          const contextReferenceIds = new Set()
          /** @type {Set<Identifier>} */
          const emitReferenceIds = new Set()
          if (contextParam.type === 'ObjectPattern') {
            const emitProperty = utils.findAssignmentProperty(
              contextParam,
              'emit'
            )
            if (!emitProperty) {
              return
            }
            const emitParam = emitProperty.value
            // `setup(props, {emit})`
            const variable =
              emitParam.type === 'Identifier'
                ? findVariable(context.getScope(), emitParam)
                : null
            if (!variable) {
              return
            }
            for (const reference of variable.references) {
              if (!reference.isRead()) {
                continue
              }

              emitReferenceIds.add(reference.identifier)
            }
          } else if (contextParam.type === 'Identifier') {
            // `setup(props, context)`
            const variable = findVariable(context.getScope(), contextParam)
            if (!variable) {
              return
            }
            for (const reference of variable.references) {
              if (!reference.isRead()) {
                continue
              }

              contextReferenceIds.add(reference.identifier)
            }
          }
          setupContexts.set(vueNode, {
            contextReferenceIds,
            emitReferenceIds
          })
        },
        /**
         * @param {CallExpression & { arguments: [Literal, ...Expression] }} node
         * @param {VueObjectData} data
         */
        'CallExpression[arguments.0.type=Literal]'(node, { node: vueNode }) {
          const callee = utils.skipChainExpression(node.callee)
          const nameLiteralNode = node.arguments[0]
          if (!nameLiteralNode || typeof nameLiteralNode.value !== 'string') {
            // cannot check
            return
          }
          const emitsDeclarations = vueEmitsDeclarations.get(vueNode)
          if (!emitsDeclarations) {
            return
          }

          let emit
          if (callee.type === 'MemberExpression') {
            const name = utils.getStaticPropertyName(callee)
            if (name === 'emit' || name === '$emit') {
              emit = { name, member: callee }
            }
          }

          // verify setup context
          const setupContext = setupContexts.get(vueNode)
          if (setupContext) {
            const { contextReferenceIds, emitReferenceIds } = setupContext
            if (callee.type === 'Identifier' && emitReferenceIds.has(callee)) {
              // verify setup(props,{emit}) {emit()}
              verify(emitsDeclarations, nameLiteralNode, vueNode)
            } else if (emit && emit.name === 'emit') {
              const memObject = utils.skipChainExpression(emit.member.object)
              if (
                memObject.type === 'Identifier' &&
                contextReferenceIds.has(memObject)
              ) {
                // verify setup(props,context) {context.emit()}
                verify(emitsDeclarations, nameLiteralNode, vueNode)
              }
            }
          }

          // verify $emit
          if (emit && emit.name === '$emit') {
            const memObject = utils.skipChainExpression(emit.member.object)
            if (utils.isThis(memObject, context)) {
              // verify this.$emit()
              verify(emitsDeclarations, nameLiteralNode, vueNode)
            }
          }
        },
        onVueObjectExit(node, { type }) {
          const emits = vueEmitsDeclarations.get(node)
          if (!vueObjectData || vueObjectData.type !== 'export') {
            if (
              emits &&
              (type === 'mark' || type === 'export' || type === 'definition')
            ) {
              vueObjectData = {
                type,
                object: node,
                emits
              }
            }
          }
          setupContexts.delete(node)
          vueEmitsDeclarations.delete(node)
        }
      })
    )
  }
}

/**
 * @param {ObjectExpression} object
 * @param {(ComponentArrayEmit | ComponentObjectEmit)[]} emits
 * @param {Literal} nameNode
 * @param {RuleContext} context
 * @returns {Rule.SuggestionReportDescriptor[]}
 */
function buildSuggest(object, emits, nameNode, context) {
  const certainEmits = emits.filter((e) => e.key)
  if (certainEmits.length) {
    const last = certainEmits[certainEmits.length - 1]
    return [
      {
        messageId: 'addOneOption',
        data: { name: `${nameNode.value}` },
        fix(fixer) {
          if (last.value === null) {
            // Array
            return fixer.insertTextAfter(last.node, `, '${nameNode.value}'`)
          } else {
            // Object
            return fixer.insertTextAfter(
              last.node,
              `, '${nameNode.value}': null`
            )
          }
        }
      }
    ]
  }

  const propertyNodes = object.properties.filter(utils.isProperty)

  const emitsOption = propertyNodes.find(
    (p) => utils.getStaticPropertyName(p) === 'emits'
  )
  if (emitsOption) {
    const sourceCode = context.getSourceCode()
    const emitsOptionValue = emitsOption.value
    if (emitsOptionValue.type === 'ArrayExpression') {
      const leftBracket = /** @type {Token} */ (sourceCode.getFirstToken(
        emitsOptionValue,
        isLeftBracket
      ))
      return [
        {
          messageId: 'addOneOption',
          data: { name: `${nameNode.value}` },
          fix(fixer) {
            return fixer.insertTextAfter(
              leftBracket,
              `'${nameNode.value}'${
                emitsOptionValue.elements.length ? ',' : ''
              }`
            )
          }
        }
      ]
    } else if (emitsOptionValue.type === 'ObjectExpression') {
      const leftBrace = /** @type {Token} */ (sourceCode.getFirstToken(
        emitsOptionValue,
        isLeftBrace
      ))
      return [
        {
          messageId: 'addOneOption',
          data: { name: `${nameNode.value}` },
          fix(fixer) {
            return fixer.insertTextAfter(
              leftBrace,
              `'${nameNode.value}': null${
                emitsOptionValue.properties.length ? ',' : ''
              }`
            )
          }
        }
      ]
    }
    return []
  }

  const sourceCode = context.getSourceCode()
  const afterOptionNode = propertyNodes.find((p) =>
    FIX_EMITS_AFTER_OPTIONS.includes(utils.getStaticPropertyName(p) || '')
  )
  return [
    {
      messageId: 'addArrayEmitsOption',
      data: { name: `${nameNode.value}` },
      fix(fixer) {
        if (afterOptionNode) {
          return fixer.insertTextAfter(
            sourceCode.getTokenBefore(afterOptionNode),
            `\nemits: ['${nameNode.value}'],`
          )
        } else if (object.properties.length) {
          const before =
            propertyNodes[propertyNodes.length - 1] ||
            object.properties[object.properties.length - 1]
          return fixer.insertTextAfter(
            before,
            `,\nemits: ['${nameNode.value}']`
          )
        } else {
          const objectLeftBrace = /** @type {Token} */ (sourceCode.getFirstToken(
            object,
            isLeftBrace
          ))
          const objectRightBrace = /** @type {Token} */ (sourceCode.getLastToken(
            object,
            isRightBrace
          ))
          return fixer.insertTextAfter(
            objectLeftBrace,
            `\nemits: ['${nameNode.value}']${
              objectLeftBrace.loc.end.line < objectRightBrace.loc.start.line
                ? ''
                : '\n'
            }`
          )
        }
      }
    },
    {
      messageId: 'addObjectEmitsOption',
      data: { name: `${nameNode.value}` },
      fix(fixer) {
        if (afterOptionNode) {
          return fixer.insertTextAfter(
            sourceCode.getTokenBefore(afterOptionNode),
            `\nemits: {'${nameNode.value}': null},`
          )
        } else if (object.properties.length) {
          const before =
            propertyNodes[propertyNodes.length - 1] ||
            object.properties[object.properties.length - 1]
          return fixer.insertTextAfter(
            before,
            `,\nemits: {'${nameNode.value}': null}`
          )
        } else {
          const objectLeftBrace = /** @type {Token} */ (sourceCode.getFirstToken(
            object,
            isLeftBrace
          ))
          const objectRightBrace = /** @type {Token} */ (sourceCode.getLastToken(
            object,
            isRightBrace
          ))
          return fixer.insertTextAfter(
            objectLeftBrace,
            `\nemits: {'${nameNode.value}': null}${
              objectLeftBrace.loc.end.line < objectRightBrace.loc.start.line
                ? ''
                : '\n'
            }`
          )
        }
      }
    }
  ]
}
