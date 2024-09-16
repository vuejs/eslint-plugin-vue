/**
 * @author Jonathan Carle
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')
const domEvents = require('../utils/dom-events.json')
const { capitalize } = require('../utils/casing.js')
const {
  findVariable,
  isOpeningBraceToken,
  isClosingBraceToken,
  isOpeningBracketToken
} = require('@eslint-community/eslint-utils')
/**
 * @typedef {import('../utils').ComponentEmit} ComponentEmit
 * @typedef {import('../utils').ComponentProp} ComponentProp
 * @typedef {import('../utils').VueObjectData} VueObjectData
 */

/**
 * Get the name param node from the given CallExpression
 * @param {CallExpression} node CallExpression
 * @returns { NameWithLoc | null }
 */
function getNameParamNode(node) {
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
 * Check if the given name matches defineEmitsNode variable name
 * @param {string} name
 * @param {CallExpression | undefined} defineEmitsNode
 * @returns {boolean}
 */
function isEmitVariableName(name, defineEmitsNode) {
  const node = defineEmitsNode?.parent

  if (node?.type === 'VariableDeclarator' && node.id.type === 'Identifier') {
    return name === node.id.name
  }

  return false
}

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow the use of event names that collide with native web event names',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-shadow-native-events.html'
    },
    fixable: null,
    hasSuggestions: false,
    schema: [
      {
        type: 'object',
        properties: {
          allowProps: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      violation:
        'Use a different emit name to avoid shadowing native events: {{ name }}.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0] || {}
    const allowProps = !!options.allowProps
    /** @type {Map<ObjectExpression | Program, { contextReferenceIds: Set<Identifier>, emitReferenceIds: Set<Identifier> }>} */
    const setupContexts = new Map()

    /** @type {string[]} */
    const definedAndReportedEmits = []

    /**
     * @typedef {object} VueTemplateDefineData
     * @property {'export' | 'mark' | 'definition' | 'setup'} type
     * @property {ObjectExpression | Program} define
     * @property {CallExpression} [defineEmits]
     */
    /** @type {VueTemplateDefineData | null} */
    let vueTemplateDefineData = null

    const programNode = context.getSourceCode().ast
    if (utils.isScriptSetup(context)) {
      // init
      vueTemplateDefineData = {
        type: 'setup',
        define: programNode
      }
    }

    /**
     * @param {NameWithLoc} nameWithLoc
     */
    function verifyEmit(nameWithLoc) {
      const name = nameWithLoc.name.toLowerCase()
      if (!domEvents.includes(name) || definedAndReportedEmits.includes(name)) {
        return
      }
      context.report({
        loc: nameWithLoc.loc,
        messageId: 'violation',
        data: {
          name
        }
      })
    }

    const callVisitor = {
      /**
       * @param {CallExpression} node
       * @param {VueObjectData} [info]
       */
      CallExpression(node, info) {
        const callee = utils.skipChainExpression(node.callee)
        const nameWithLoc = getNameParamNode(node)
        if (!nameWithLoc) {
          // cannot check
          return
        }
        const vueDefineNode = info ? info.node : programNode

        let emit
        if (callee.type === 'MemberExpression') {
          const name = utils.getStaticPropertyName(callee)
          if (name === 'emit' || name === '$emit') {
            emit = { name, member: callee }
          }
        }

        // verify setup context
        const setupContext = setupContexts.get(vueDefineNode)
        if (setupContext) {
          const { contextReferenceIds, emitReferenceIds } = setupContext
          if (callee.type === 'Identifier' && emitReferenceIds.has(callee)) {
            // verify setup(props,{emit}) {emit()}
            verifyEmit(nameWithLoc)
          } else if (emit && emit.name === 'emit') {
            const memObject = utils.skipChainExpression(emit.member.object)
            if (
              memObject.type === 'Identifier' &&
              contextReferenceIds.has(memObject)
            ) {
              // verify setup(props,context) {context.emit()}
              verifyEmit(nameWithLoc)
            }
          }
        }

        // verify $emit
        if (emit && emit.name === '$emit') {
          const memObject = utils.skipChainExpression(emit.member.object)
          if (utils.isThis(memObject, context)) {
            // verify this.$emit()
            verifyEmit(nameWithLoc)
          }
        }
      }
    }
    /**
     * @param {ComponentEmit[]} emits
     */
    const verifyEmitDeclaration = (emits) => {
      for (const { node, emitName } of emits) {
        if (!node || !emitName || !domEvents.includes(emitName.toLowerCase())) {
          continue
        }

        definedAndReportedEmits.push(emitName)
        context.report({
          messageId: 'violation',
          data: { name: emitName },
          loc: node.loc
        })
      }
    }

    return utils.compositingVisitors(
      utils.defineTemplateBodyVisitor(
        context,
        {
          /** @param { CallExpression } node */
          CallExpression(node) {
            const callee = utils.skipChainExpression(node.callee)
            const nameWithLoc = getNameParamNode(node)
            if (!nameWithLoc) {
              // cannot check
              return
            }

            // e.g. $emit() / emit() in template
            if (
              callee.type === 'Identifier' &&
              (callee.name === '$emit' ||
                (vueTemplateDefineData?.defineEmits &&
                  isEmitVariableName(
                    callee.name,
                    vueTemplateDefineData.defineEmits
                  )))
            ) {
              verifyEmit(nameWithLoc)
            }
          }
        },
        utils.compositingVisitors(
          utils.defineScriptSetupVisitor(context, {
            onDefineEmitsEnter: (node, emits) => {
              verifyEmitDeclaration(emits)

              // TODO: needed?
              if (
                vueTemplateDefineData &&
                vueTemplateDefineData.type === 'setup'
              ) {
                vueTemplateDefineData.defineEmits = node
              }

              if (
                !node.parent ||
                node.parent.type !== 'VariableDeclarator' ||
                node.parent.init !== node
              ) {
                return
              }

              const emitParam = node.parent.id
              const variable =
                emitParam.type === 'Identifier'
                  ? findVariable(utils.getScope(context, emitParam), emitParam)
                  : null
              if (!variable) {
                return
              }
              /** @type {Set<Identifier>} */
              const emitReferenceIds = new Set()
              for (const reference of variable.references) {
                if (!reference.isRead()) {
                  continue
                }

                emitReferenceIds.add(reference.identifier)
              }
              setupContexts.set(programNode, {
                contextReferenceIds: new Set(),
                emitReferenceIds
              })
            },
            onDefinePropsEnter: (node, props) => {
              if (allowProps) {
                // TODO: verify props
              }
            },
            ...callVisitor
          }),
          utils.defineVueVisitor(context, {
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
                    ? findVariable(
                        utils.getScope(context, emitParam),
                        emitParam
                      )
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
                const variable = findVariable(
                  utils.getScope(context, contextParam),
                  contextParam
                )
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
            onVueObjectEnter(node) {
              const emits = utils.getComponentEmitsFromOptions(node)
              verifyEmitDeclaration(emits)

              if (allowProps) {
                // TODO: verify props
                // utils.getComponentPropsFromOptions(node)
              }
            },
            onVueObjectExit(node, { type }) {
              if (
                (!vueTemplateDefineData ||
                  (vueTemplateDefineData.type !== 'export' &&
                    vueTemplateDefineData.type !== 'setup')) &&
                (type === 'mark' || type === 'export' || type === 'definition')
              ) {
                vueTemplateDefineData = {
                  type,
                  define: node
                }
              }
              setupContexts.delete(node)
            },
            ...callVisitor
          })
        )
      )
    )
  }
}
