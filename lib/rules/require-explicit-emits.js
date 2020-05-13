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

    const setupFunctions = new Map()
    /** @type { Map<Property, EmitCellName> } */
    const setupEmitCellNames = new Map()
    /** @type {Set<EmitCellName>} */
    const objectEmitCellNames = new Set()
    /** @type {EmitCellName[]} */
    const templateEmitCellNames = []
    /** @type { { type: 'export' | 'mark' | 'definition', object: ObjectExpression, emits: (ComponentArrayEmit | ComponentObjectEmit)[] } | null } */
    let vueObjectData = null

    function addSetupEmitCellName (property, nameLiteralNode) {
      let list = setupEmitCellNames.get(property)
      if (!list) {
        list = []
        setupEmitCellNames.set(property, list)
      }
      list.push({
        node: nameLiteralNode,
        name: nameLiteralNode.value
      })
    }
    function addObjectEmitCellName (nameLiteralNode) {
      objectEmitCellNames.add({
        node: nameLiteralNode,
        name: nameLiteralNode.value
      })
    }
    function addTemplateEmitCellName (nameLiteralNode) {
      templateEmitCellNames.push({
        node: nameLiteralNode,
        name: nameLiteralNode.value
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
      Object.assign(
        {
          'Property[value.type=/^(Arrow)?FunctionExpression$/]' (node) {
            if (utils.getStaticPropertyName(node) !== 'setup') {
              return
            }
            const param = node.value.params[1]
            if (!param) {
              // no arguments
              return
            }
            if (param.type === 'RestElement') {
              // cannot check
              return
            }
            if (param.type === 'ArrayPattern') {
              // cannot check
              return
            }
            let emitParam
            if (param.type === 'ObjectPattern') {
              const emitProperty = param.properties.find(p => p.type === 'Property' && utils.getStaticPropertyName(p) === 'emit')
              if (!emitProperty) {
                return
              }
              emitParam = emitProperty.value
            }
            setupFunctions.set(node.value, {
              setupProperty: node,
              contextParam: param,
              emitParam,
              contextReferenceIds: new Set(),
              emitReferenceIds: new Set()
            })
          },
          ':function > Identifier, :function > ObjectPattern' (node) {
            // find `setup(props, *context*)`
            const setupFunctionData = setupFunctions.get(node.parent)
            if (!setupFunctionData || setupFunctionData.contextParam !== node) {
              return
            }
            if (node.type === 'Identifier') {
              // `setup(props, context)`
              const variable = findVariable(context.getScope(), node)
              if (!variable) {
                return
              }
              const { contextReferenceIds } = setupFunctionData
              for (const reference of variable.references) {
                if (!reference.isRead()) {
                  continue
                }

                contextReferenceIds.add(reference.identifier)
              }
            } else if (node.type === 'ObjectPattern') {
              // `setup(props, {emit})`
              const variable = findVariable(context.getScope(), setupFunctionData.emitParam)
              if (!variable) {
                return
              }
              const { emitReferenceIds } = setupFunctionData
              for (const reference of variable.references) {
                if (!reference.isRead()) {
                  continue
                }

                emitReferenceIds.add(reference.identifier)
              }
            }
          },
          'CallExpression[arguments.0.type=Literal]' (node) {
            const callee = node.callee
            const nameLiteralNode = node.arguments[0]
            if (!nameLiteralNode || typeof nameLiteralNode.value !== 'string') {
              // cannot check
              return
            }
            let emit
            if (callee.type === 'MemberExpression') {
              const name = utils.getStaticPropertyName(callee)
              if (name === 'emit' || name === '$emit') {
                emit = { name, member: callee }
              }
            }

            // find setup context
            for (const { contextReferenceIds, emitReferenceIds, setupProperty } of setupFunctions.values()) {
              if (emitReferenceIds.has(callee)) {
                addSetupEmitCellName(setupProperty, nameLiteralNode)
              }
              if (emit && emit.name === 'emit' && contextReferenceIds.has(emit.member.object)) {
                addSetupEmitCellName(setupProperty, nameLiteralNode)
              }
            }

            // find $emit
            if (emit && emit.name === '$emit') {
              const objectType = emit.member.object.type
              if (objectType === 'Identifier' || objectType === 'ThisExpression') {
                addObjectEmitCellName(nameLiteralNode)
              }
            }
          },
          ':function:exit' (node) {
            setupFunctions.delete(node)
          }
        },
        utils.executeOnVue(context, (obj, type) => {
          const emitsDeclarations = utils.getComponentEmits(obj)
          if (!vueObjectData || vueObjectData.type !== 'export') {
            vueObjectData = {
              type,
              object: obj,
              emits: emitsDeclarations
            }
          }

          const emitsDeclarationNames = new Set(emitsDeclarations.map(e => e.emitName))

          const componentEmitCellNames = []

          // extract this.$emit()
          for (const emit of [...objectEmitCellNames]) {
            if (obj.range[0] <= emit.node.range[0] && emit.node.range[1] <= obj.range[1]) {
              componentEmitCellNames.push(emit)
              objectEmitCellNames.delete(emit)// verified
            }
          }

          // extract setup(props,context) {context.emit()}
          for (const prop of obj.properties) {
            const setupEmits = setupEmitCellNames.get(prop)
            if (!setupEmits) {
              continue
            }
            componentEmitCellNames.push(...setupEmits)
            setupEmitCellNames.delete(prop)// verified
          }

          for (const { name, node } of componentEmitCellNames) {
            if (emitsDeclarationNames.has(name)) {
              continue
            }
            context.report({
              node,
              messageId: 'missing',
              data: {
                name
              },
              suggest: buildSuggest(obj, emitsDeclarations, node, context)
            })
          }
        })
      ))
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
