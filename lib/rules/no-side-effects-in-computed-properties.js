/**
 * @fileoverview Don't introduce side effects in computed properties
 * @author Michał Sajnóg
 */
'use strict'
const { ReferenceTracker, findVariable } = require('eslint-utils')
const utils = require('../utils')

/**
 * @typedef {import('../utils').VueObjectData} VueObjectData
 * @typedef {import('../utils').ComponentComputedProperty} ComponentComputedProperty
 */

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow side effects in computed properties',
      categories: ['vue3-essential', 'essential'],
      url:
        'https://eslint.vuejs.org/rules/no-side-effects-in-computed-properties.html'
    },
    fixable: null,
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @type {Map<ObjectExpression, ComponentComputedProperty[]>} */
    const computedPropertiesMap = new Map()
    /** @type {Array<FunctionExpression | ArrowFunctionExpression>} */
    const computedCallNodes = []
    /** @type {Array<FunctionExpression | ArrowFunctionExpression | FunctionDeclaration>} */
    const setupFunctions = []

    /**
     * @typedef {object} ScopeStack
     * @property {ScopeStack | null} upper
     * @property {BlockStatement | Expression | null} body
     */
    /**
     * @type {ScopeStack | null}
     */
    let scopeStack = null

    /** @param {FunctionExpression | ArrowFunctionExpression | FunctionDeclaration} node */
    function onFunctionEnter(node) {
      scopeStack = {
        upper: scopeStack,
        body: node.body
      }
    }

    function onFunctionExit() {
      scopeStack = scopeStack && scopeStack.upper
    }

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

            const getterBody = utils.getGetterBodyFromComputedFunction(node)
            if (getterBody) {
              computedCallNodes.push(getterBody)
            }
          }
        }
      },
      utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          computedPropertiesMap.set(node, utils.getComputedProperties(node))
        },
        ':function': onFunctionEnter,
        ':function:exit': onFunctionExit,
        onSetupFunctionEnter(node) {
          setupFunctions.push(node)
        },

        /**
         * @param {(Identifier | ThisExpression) & {parent: MemberExpression}} node
         * @param {VueObjectData} data
         */
        'MemberExpression > :matches(Identifier, ThisExpression)'(
          node,
          { node: vueNode }
        ) {
          if (!scopeStack) {
            return
          }
          const targetBody = scopeStack.body

          const computedProperty = /** @type {ComponentComputedProperty[]} */ (computedPropertiesMap.get(
            vueNode
          )).find((cp) => {
            return (
              cp.value &&
              node.loc.start.line >= cp.value.loc.start.line &&
              node.loc.end.line <= cp.value.loc.end.line &&
              targetBody === cp.value
            )
          })
          if (computedProperty) {
            if (!utils.isThis(node, context)) {
              return
            }
            const mem = node.parent
            if (mem.object !== node) {
              return
            }

            const invalid = utils.findMutating(mem)
            if (invalid) {
              context.report({
                node: invalid.node,
                message:
                  'Unexpected side effect in "{{key}}" computed property.',
                data: { key: computedProperty.key || 'Unknown' }
              })
            }
            return
          }

          // ignore `this` for computed functions
          if (node.type === 'ThisExpression') {
            return
          }

          const computedFunction = computedCallNodes.find(
            (c) =>
              node.loc.start.line >= c.loc.start.line &&
              node.loc.end.line <= c.loc.end.line &&
              targetBody === c.body
          )
          if (!computedFunction) {
            return
          }

          const mem = node.parent
          if (mem.object !== node) {
            return
          }

          const variable = findVariable(context.getScope(), node)
          if (!variable || variable.defs.length !== 1) {
            return
          }

          const def = variable.defs[0]
          if (
            def.type === 'ImplicitGlobalVariable' ||
            def.type === 'TDZ' ||
            def.type === 'ImportBinding'
          ) {
            return
          }

          const isDeclaredInsideSetup = setupFunctions.some(
            (setupFn) =>
              def.node.loc.start.line >= setupFn.loc.start.line &&
              def.node.loc.end.line <= setupFn.loc.end.line
          )
          if (!isDeclaredInsideSetup) {
            return
          }

          if (
            def.node.loc.start.line >= computedFunction.loc.start.line &&
            def.node.loc.end.line <= computedFunction.loc.end.line
          ) {
            // mutating local variables are accepted
            return
          }

          const invalid = utils.findMutating(node)
          if (invalid) {
            context.report({
              node: invalid.node,
              message: 'Unexpected side effect in computed function.'
            })
          }
        }
      })
    )
  }
}
