/**
 * @fileoverview Enforces that a return statement is present in computed property (return-in-computed-property)
 * @author Armano
 */
'use strict'
const { ReferenceTracker } = require('eslint-utils')
const utils = require('../utils')

/**
 * @typedef {import('../utils').ComponentComputedProperty} ComponentComputedProperty
 */

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'enforce that a return statement is present in computed property',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/return-in-computed-property.html'
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      {
        type: 'object',
        properties: {
          treatUndefinedAsUnspecified: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ]
  },
  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0] || {}
    const treatUndefinedAsUnspecified = !(
      options.treatUndefinedAsUnspecified === false
    )

    /**
     * @type {Set<ComponentComputedProperty>}
     */
    const computedProperties = new Set()
    /** @type {(FunctionExpression | ArrowFunctionExpression)[]} */
    const computedFunctionNodes = []

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return Object.assign(
      {
        Program() {
          const tracker = new ReferenceTracker(context.getScope())
          const traceMap = utils.createCompositionApiTraceMap({
            [ReferenceTracker.ESM]: true,
            computed: {
              [ReferenceTracker.CALL]: true
            }
          })

          for (const { node } of tracker.iterateEsmReferences(traceMap)) {
            if (node.type !== 'CallExpression') {
              continue
            }

            const getter = utils.getGetterBodyFromComputedFunction(node)
            if (getter) {
              computedFunctionNodes.push(getter)
            }
          }
        }
      },
      utils.defineVueVisitor(context, {
        onVueObjectEnter(obj) {
          for (const computedProperty of utils.getComputedProperties(obj)) {
            computedProperties.add(computedProperty)
          }
        }
      }),
      utils.executeOnFunctionsWithoutReturn(
        treatUndefinedAsUnspecified,
        (node) => {
          computedProperties.forEach((cp) => {
            if (cp.value && cp.value.parent === node) {
              context.report({
                node,
                message:
                  'Expected to return a value in "{{name}}" computed property.',
                data: {
                  name: cp.key || 'Unknown'
                }
              })
            }
          })
          computedFunctionNodes.forEach((cf) => {
            if (cf === node) {
              context.report({
                node,
                message: 'Expected to return a value in computed function.'
              })
            }
          })
        }
      )
    )
  }
}
