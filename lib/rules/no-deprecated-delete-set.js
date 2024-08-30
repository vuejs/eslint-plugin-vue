/**
 * @author Wayne Zhang
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')
const { findVariable } = require('@eslint-community/eslint-utils')

const deprecatedApis = new Set(['set', 'delete'])
const deprecatedImportApis = new Set(['set', 'del'])
const deprecatedDollarApis = new Set(['$set', '$delete'])

/**
 * @param {Expression|Super} node
 */
function isVue(node) {
  return node.type === 'Identifier' && node.name === 'Vue'
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow using deprecated `$delete` and `$set` (in Vue.js 3.0.0+)',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-deprecated-delete-set.html'
    },
    fixable: null,
    schema: [],
    messages: {
      deprecated: 'The `$delete`, `$set` is deprecated.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /**
     * @param {Identifier} identifier
     * @param {RuleContext} context
     * @returns {CallExpression|undefined}
     */
    function getVueDeprecatedCallExpression(identifier, context) {
      // Instance API: this.$set()
      if (
        deprecatedDollarApis.has(identifier.name) &&
        identifier.parent.type === 'MemberExpression' &&
        utils.isThis(identifier.parent.object, context) &&
        identifier.parent.parent.type === 'CallExpression' &&
        identifier.parent.parent.callee === identifier.parent
      ) {
        return identifier.parent.parent
      }

      // Vue 2 Global API: Vue.set()
      if (
        deprecatedApis.has(identifier.name) &&
        identifier.parent.type === 'MemberExpression' &&
        isVue(identifier.parent.object) &&
        identifier.parent.parent.type === 'CallExpression' &&
        identifier.parent.parent.callee === identifier.parent
      ) {
        return identifier.parent.parent
      }

      // Vue 3 Global API
      if (
        identifier.parent.type === 'CallExpression' &&
        identifier.parent.callee === identifier
      ) {
        const variable = findVariable(
          utils.getScope(context, identifier),
          identifier
        )

        if (variable != null && variable.defs.length === 1) {
          const def = variable.defs[0]

          // import { set as st } from 'vue'; st()
          if (
            def.type === 'ImportBinding' &&
            def.node.type === 'ImportSpecifier' &&
            def.node.imported.type === 'Identifier' &&
            deprecatedImportApis.has(def.node.imported.name) &&
            def.node.parent.type === 'ImportDeclaration' &&
            def.node.parent.source.value === 'vue'
          ) {
            return identifier.parent
          }

          // const { set, delete } = require('vue'); set()
          if (
            def.type === 'Variable' &&
            def.node.type === 'VariableDeclarator' &&
            def.node.id.type === 'ObjectPattern' &&
            def.node.init?.type === 'CallExpression' &&
            def.node.init.callee.type === 'Identifier' &&
            def.node.init.callee.name === 'require' &&
            def.node.init.arguments.length === 1 &&
            def.node.init.arguments[0].type === 'Literal' &&
            def.node.init.arguments[0].value === 'vue'
          ) {
            const properties = def.node.id.properties
            for (const prop of properties) {
              if (
                prop.type === 'Property' &&
                prop.key.type === 'Identifier' &&
                deprecatedImportApis.has(prop.key.name) &&
                prop.value.type === 'Identifier' &&
                prop.value.name === identifier.name
              ) {
                return identifier.parent
              }
            }
          }
        }
      }

      return undefined
    }

    const nodeVisitor = {
      /** @param {Identifier} node */
      Identifier(node) {
        const callExpression = getVueDeprecatedCallExpression(node, context)
        if (!callExpression) {
          return
        }

        context.report({
          node,
          messageId: 'deprecated'
        })
      }
    }

    return utils.compositingVisitors(
      utils.defineVueVisitor(context, nodeVisitor),
      utils.defineScriptSetupVisitor(context, nodeVisitor)
    )
  }
}
