/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const { findVariable } = require('eslint-utils')
const utils = require('../utils')
const casing = require('../utils/casing')
const { toRegExp } = require('../utils/regexp')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

const ALLOWED_CASE_OPTIONS = ['kebab-case', 'camelCase']
const DEFAULT_CASE = 'kebab-case'

/**
 * Get the name param node from the given CallExpression
 * @param {CallExpression} node CallExpression
 * @returns { Literal & { value: string } | null }
 */
function getNameParamNode(node) {
  const nameLiteralNode = node.arguments[0]
  if (
    !nameLiteralNode ||
    nameLiteralNode.type !== 'Literal' ||
    typeof nameLiteralNode.value !== 'string'
  ) {
    // cannot check
    return null
  }

  return /** @type {Literal & { value: string }} */ (nameLiteralNode)
}
/**
 * Get the callee member node from the given CallExpression
 * @param {CallExpression} node CallExpression
 */
function getCalleeMemberNode(node) {
  const callee = utils.skipChainExpression(node.callee)

  if (callee.type === 'MemberExpression') {
    const name = utils.getStaticPropertyName(callee)
    if (name) {
      return { name, member: callee }
    }
  }
  return null
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const OBJECT_OPTION_SCHEMA = {
  type: 'object',
  properties: {
    ignores: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false
    }
  },
  additionalProperties: false
}
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce specific casing for custom event name',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/custom-event-name-casing.html'
    },
    fixable: null,
    schema: {
      anyOf: [
        {
          type: 'array',
          items: [
            {
              enum: ALLOWED_CASE_OPTIONS
            },
            OBJECT_OPTION_SCHEMA
          ]
        },
        // For backward compatibility
        {
          type: 'array',
          items: [OBJECT_OPTION_SCHEMA]
        }
      ]
    },
    messages: {
      unexpected: "Custom event name '{{name}}' must be {{caseType}}."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @type {Map<ObjectExpression, {contextReferenceIds:Set<Identifier>,emitReferenceIds:Set<Identifier>}>} */
    const setupContexts = new Map()
    const options =
      context.options.length === 1 && typeof context.options[0] !== 'string'
        ? // For backward compatibility
          [undefined, context.options[0]]
        : context.options
    const caseType = options[0] || DEFAULT_CASE
    const objectOption = options[1] || {}
    const caseChecker = casing.getChecker(caseType)
    /** @type {RegExp[]} */
    const ignores = (objectOption.ignores || []).map(toRegExp)

    /**
     * Check whether the given event name is valid.
     * @param {string} name The name to check.
     * @returns {boolean} `true` if the given event name is valid.
     */
    function isValidEventName(name) {
      return caseChecker(name) || name.startsWith('update:')
    }

    /**
     * @param { Literal & { value: string } } nameLiteralNode
     */
    function verify(nameLiteralNode) {
      const name = nameLiteralNode.value
      if (isValidEventName(name) || ignores.some((re) => re.test(name))) {
        return
      }
      context.report({
        node: nameLiteralNode,
        messageId: 'unexpected',
        data: {
          name,
          caseType
        }
      })
    }

    return utils.defineTemplateBodyVisitor(
      context,
      {
        CallExpression(node) {
          const callee = node.callee
          const nameLiteralNode = getNameParamNode(node)
          if (!nameLiteralNode) {
            // cannot check
            return
          }
          if (callee.type === 'Identifier' && callee.name === '$emit') {
            verify(nameLiteralNode)
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
            const contextReferenceIds = new Set()
            const emitReferenceIds = new Set()
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
              const variable = findVariable(context.getScope(), emitParam)
              if (!variable) {
                return
              }
              for (const reference of variable.references) {
                emitReferenceIds.add(reference.identifier)
              }
            } else {
              // `setup(props, context)`
              const variable = findVariable(context.getScope(), contextParam)
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
            const nameLiteralNode = getNameParamNode(node)
            if (!nameLiteralNode) {
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
                verify(nameLiteralNode)
              } else {
                const emit = getCalleeMemberNode(node)
                if (
                  emit &&
                  emit.name === 'emit' &&
                  emit.member.object.type === 'Identifier' &&
                  contextReferenceIds.has(emit.member.object)
                ) {
                  // verify setup(props,context) {context.emit()}
                  verify(nameLiteralNode)
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
            const nameLiteralNode = getNameParamNode(node)
            if (!nameLiteralNode) {
              // cannot check
              return
            }
            const emit = getCalleeMemberNode(node)
            // verify $emit
            if (emit && emit.name === '$emit') {
              // verify this.$emit()
              verify(nameLiteralNode)
            }
          }
        }
      )
    )
  }
}
