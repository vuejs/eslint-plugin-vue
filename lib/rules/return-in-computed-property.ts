/**
 * @fileoverview Enforces that a return statement is present in computed property (return-in-computed-property)
 * @author Armano
 */
import type { ComponentComputedProperty } from '../utils/index.js'
import { ReferenceTracker } from '@eslint-community/eslint-utils'
import utils from '../utils/index.js'
import { getScope } from '../utils/scope.ts'

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'enforce that a return statement is present in computed property',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/return-in-computed-property.html'
    },
    fixable: null,
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
    ],
    messages: {
      expectedReturnInFunction:
        'Expected to return a value in computed function.',
      expectedReturnInProperty:
        'Expected to return a value in "{{name}}" computed property.'
    }
  },
  create(context: RuleContext) {
    const options = context.options[0] || {}
    const treatUndefinedAsUnspecified = !(
      options.treatUndefinedAsUnspecified === false
    )

    const computedProperties = new Set<ComponentComputedProperty>()
    const computedFunctionNodes: (
      | FunctionExpression
      | ArrowFunctionExpression
    )[] = []

    return Object.assign(
      {
        Program(program: Program) {
          const tracker = new ReferenceTracker(getScope(context, program))
          const map = {
            computed: {
              [ReferenceTracker.CALL]: true
            }
          }

          for (const { node } of utils.iterateReferencesTraceMap(
            tracker,
            map
          )) {
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
          for (const cp of computedProperties) {
            if (cp.value && cp.value.parent === node) {
              context.report({
                node,
                messageId: 'expectedReturnInProperty',
                data: {
                  name: cp.key || 'Unknown'
                }
              })
            }
          }
          for (const cf of computedFunctionNodes) {
            if (cf === node) {
              context.report({
                node,
                messageId: 'expectedReturnInFunction'
              })
            }
          }
        }
      )
    )
  }
}
