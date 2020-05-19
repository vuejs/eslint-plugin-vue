/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'
// @ts-check

/**
 * @typedef {import('vue-eslint-parser').AST.ESLintLiteral} Literal
 * @typedef {import('vue-eslint-parser').AST.ESLintProperty} Property
 * @typedef {import('vue-eslint-parser').AST.ESLintObjectExpression} ObjectExpression
 * @typedef {import('../utils').ComponentArrayEmit} ComponentArrayEmit
 * @typedef {import('../utils').ComponentObjectEmit} ComponentObjectEmit
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
  'props',
  'propsData',
  'setup',
  'data',
  'computed',
  'watch',
  'methods',
  'template', 'render',
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
  'beforeDestroy',
  'destroyed'
]

/**
 * Check whether the given token is a left brace.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a left brace.
 */
function isLeftBrace (token) {
  return token != null && token.type === 'Punctuator' && token.value === '{'
}

/**
 * Check whether the given token is a right brace.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a right brace.
 */
function isRightBrace (token) {
  return token != null && token.type === 'Punctuator' && token.value === '}'
}

/**
 * Check whether the given token is a left bracket.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a left bracket.
 */
function isLeftBracket (token) {
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
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-explicit-emits.html'
    },
    fixable: null,
    schema: [],
    messages: {
      missing: 'The "{{name}}" event has been triggered but not declared on `emits` option.',
      addOneOption: 'Add the "{{name}}" to `emits` option.',
      addArrayEmitsOption: 'Add the `emits` option with array syntax and define "{{name}}" event.',
      addObjectEmitsOption: 'Add the `emits` option with object syntax and define "{{name}}" event.'
    }
  },

  create (context) {
    /** @typedef { { node: Literal, name: string } } EmitCellName */

    const setupContexts = new Map()
    const vueEmitsDeclarations = new Map()

    /** @type {EmitCellName[]} */
    const templateEmitCellNames = []
    /** @type { { type: 'export' | 'mark' | 'definition', object: ObjectExpression, emits: (ComponentArrayEmit | ComponentObjectEmit)[] } | null } */
    let vueObjectData = null

    function addTemplateEmitCellName (nameLiteralNode) {
      templateEmitCellNames.push({
        node: nameLiteralNode,
        name: nameLiteralNode.value
      })
    }

    function verify (emitsDeclarations, nameLiteralNode, vueObjectNode) {
      const name = nameLiteralNode.value
      if (emitsDeclarations.some(e => e.emitName === name)) {
        return
      }
      context.report({
        node: nameLiteralNode,
        messageId: 'missing',
        data: {
          name
        },
        suggest: buildSuggest(vueObjectNode, emitsDeclarations, nameLiteralNode, context)
      })
    }

    return utils.defineTemplateBodyVisitor(context,
      {
        'CallExpression[arguments.0.type=Literal]' (node) {
          const callee = node.callee
          const nameLiteralNode = node.arguments[0]
          if (!nameLiteralNode || typeof nameLiteralNode.value !== 'string') {
            // cannot check
            return
          }
          if (callee.type === 'Identifier' && callee.name === '$emit') {
            addTemplateEmitCellName(nameLiteralNode)
          }
        },
        "VElement[parent.type!='VElement']:exit" () {
          if (!vueObjectData) {
            return
          }
          const emitsDeclarationNames = new Set(vueObjectData.emits.map(e => e.emitName))

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
              suggest: buildSuggest(vueObjectData.object, vueObjectData.emits, node, context)
            })
          }
        }
      },
      utils.defineVueVisitor(context, {
        ObjectExpression (node, { node: vueNode }) {
          if (node !== vueNode) {
            return
          }
          vueEmitsDeclarations.set(node, utils.getComponentEmits(node))

          const setupProperty = node.properties.find(p => utils.getStaticPropertyName(p) === 'setup')
          if (!setupProperty) {
            return
          }
          if (!/^(Arrow)?FunctionExpression$/.test(setupProperty.value.type)) {
            return
          }
          const contextParam = setupProperty.value.params[1]
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
          const contextReferenceIds = new Set()
          const emitReferenceIds = new Set()
          if (contextParam.type === 'ObjectPattern') {
            const emitProperty = contextParam.properties.find(p => p.type === 'Property' && utils.getStaticPropertyName(p) === 'emit')
            if (!emitProperty) {
              return
            }
            const emitParam = emitProperty.value
            // `setup(props, {emit})`
            const variable = findVariable(context.getScope(), emitParam)
            if (!variable) {
              return
            }
            for (const reference of variable.references) {
              if (!reference.isRead()) {
                continue
              }

              emitReferenceIds.add(reference.identifier)
            }
          } else {
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
          setupContexts.set(node, {
            contextReferenceIds,
            emitReferenceIds
          })
        },
        'CallExpression[arguments.0.type=Literal]' (node, { node: vueNode }) {
          const callee = node.callee
          const nameLiteralNode = node.arguments[0]
          if (!nameLiteralNode || typeof nameLiteralNode.value !== 'string') {
            // cannot check
            return
          }
          const emitsDeclarations = vueEmitsDeclarations.get(vueNode)

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
            if (emitReferenceIds.has(callee)) {
            // verify setup(props,{emit}) {emit()}
              verify(emitsDeclarations, nameLiteralNode, vueNode)
            } else if (emit && emit.name === 'emit' && contextReferenceIds.has(emit.member.object)) {
            // verify setup(props,context) {context.emit()}
              verify(emitsDeclarations, nameLiteralNode, vueNode)
            }
          }

          // verify $emit
          if (emit && emit.name === '$emit') {
            if (utils.isThis(emit.member.object, context)) {
              // verify this.$emit()
              verify(emitsDeclarations, nameLiteralNode, vueNode)
            }
          }
        },
        'ObjectExpression:exit' (node, { node: vueNode, type }) {
          if (node !== vueNode) {
            return
          }
          if (!vueObjectData || vueObjectData.type !== 'export') {
            vueObjectData = {
              type,
              object: node,
              emits: vueEmitsDeclarations.get(node)
            }
          }
          setupContexts.delete(node)
          vueEmitsDeclarations.delete(node)
        }
      }),
    )
  }
}

/**
 * @param {ObjectExpression} object
 * @param {(ComponentArrayEmit | ComponentObjectEmit)[]} emits
 * @param {Literal} nameNode
 * @param {RuleContext} context
 */
function buildSuggest (object, emits, nameNode, context) {
  const certainEmits = emits.filter(e => e.key)
  if (certainEmits.length) {
    const last = certainEmits[certainEmits.length - 1]
    return [
      {
        messageId: 'addOneOption',
        data: { name: nameNode.value },
        fix (fixer) {
          if (last.value === null) {
            // Array
            return fixer.insertTextAfter(last.node, `, '${nameNode.value}'`)
          } else {
            // Object
            return fixer.insertTextAfter(last.node, `, '${nameNode.value}': null`)
          }
        }
      }
    ]
  }

  const propertyNodes = object.properties
    .filter(p =>
      p.type === 'Property' &&
      p.key.type === 'Identifier'
    )

  const emitsOption = propertyNodes.find(p => utils.getStaticPropertyName(p) === 'emits')
  if (emitsOption) {
    const sourceCode = context.getSourceCode()
    const emitsOptionValue = emitsOption.value
    if (emitsOptionValue.type === 'ArrayExpression') {
      const leftBracket = sourceCode.getFirstToken(emitsOptionValue, isLeftBracket)
      return [
        {
          messageId: 'addOneOption',
          data: { name: nameNode.value },
          fix (fixer) {
            return fixer.insertTextAfter(leftBracket, `'${nameNode.value}'${emitsOptionValue.elements.length ? ',' : ''}`)
          }
        }
      ]
    } else if (emitsOptionValue.type === 'ObjectExpression') {
      const leftBrace = sourceCode.getFirstToken(emitsOptionValue, isLeftBrace)
      return [
        {
          messageId: 'addOneOption',
          data: { name: nameNode.value },
          fix (fixer) {
            return fixer.insertTextAfter(leftBrace, `'${nameNode.value}': null${emitsOptionValue.properties.length ? ',' : ''}`)
          }
        }
      ]
    }
    return []
  }

  const sourceCode = context.getSourceCode()
  const afterOptionNode = propertyNodes.find(p => FIX_EMITS_AFTER_OPTIONS.includes(utils.getStaticPropertyName(p)))
  return [
    {
      messageId: 'addArrayEmitsOption',
      data: { name: nameNode.value },
      fix (fixer) {
        if (afterOptionNode) {
          return fixer.insertTextAfter(sourceCode.getTokenBefore(afterOptionNode), `\nemits: ['${nameNode.value}'],`)
        } else if (object.properties.length) {
          const before = propertyNodes[propertyNodes.length - 1] || object.properties[object.properties.length - 1]
          return fixer.insertTextAfter(before, `,\nemits: ['${nameNode.value}']`)
        } else {
          const objectLeftBrace = sourceCode.getFirstToken(object, isLeftBrace)
          const objectRightBrace = sourceCode.getLastToken(object, isRightBrace)
          return fixer.insertTextAfter(objectLeftBrace, `\nemits: ['${nameNode.value}']${objectLeftBrace.loc.end.line < objectRightBrace.loc.start.line ? '' : '\n'}`)
        }
      }
    },
    {
      messageId: 'addObjectEmitsOption',
      data: { name: nameNode.value },
      fix (fixer) {
        if (afterOptionNode) {
          return fixer.insertTextAfter(sourceCode.getTokenBefore(afterOptionNode), `\nemits: {'${nameNode.value}': null},`)
        } else if (object.properties.length) {
          const before = propertyNodes[propertyNodes.length - 1] || object.properties[object.properties.length - 1]
          return fixer.insertTextAfter(before, `,\nemits: {'${nameNode.value}': null}`)
        } else {
          const objectLeftBrace = sourceCode.getFirstToken(object, isLeftBrace)
          const objectRightBrace = sourceCode.getLastToken(object, isRightBrace)
          return fixer.insertTextAfter(objectLeftBrace, `\nemits: {'${nameNode.value}': null}${objectLeftBrace.loc.end.line < objectRightBrace.loc.start.line ? '' : '\n'}`)
        }
      }
    }
  ]
}
