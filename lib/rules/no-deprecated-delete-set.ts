/**
 * @author Wayne Zhang
 * See LICENSE file in root directory for full license.
 */
import type { TYPES } from '@eslint-community/eslint-utils'
import utils from '../utils/index.js'
import { ReferenceTracker } from '@eslint-community/eslint-utils'

const deletedImportApisMap: TYPES.TraceMap = {
  set: {
    [ReferenceTracker.CALL]: true
  },
  del: {
    [ReferenceTracker.CALL]: true
  }
}
const deprecatedApis = new Set(['set', 'delete'])
const deprecatedDollarApis = new Set(['$set', '$delete'])

function isVue(node: Expression | Super) {
  return node.type === 'Identifier' && node.name === 'Vue'
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow using deprecated `$delete` and `$set` (in Vue.js 3.0.0+)',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-deprecated-delete-set.html'
    },
    fixable: null,
    schema: [],
    messages: {
      deprecated: 'The `$delete`, `$set` is deprecated.'
    }
  },
  create(context: RuleContext) {
    function getVueDeprecatedCallExpression(
      identifier: Identifier,
      context: RuleContext
    ): CallExpression | undefined {
      // Instance API: this.$set()
      // and Vue 2 Global API: Vue.set()
      return identifier.parent.type === 'MemberExpression' &&
        identifier.parent.parent.type === 'CallExpression' &&
        identifier.parent.parent.callee === identifier.parent &&
        ((deprecatedDollarApis.has(identifier.name) &&
          utils.isThis(identifier.parent.object, context)) ||
          (deprecatedApis.has(identifier.name) &&
            isVue(identifier.parent.object)))
        ? identifier.parent.parent
        : undefined
    }

    const nodeVisitor = {
      Identifier(node: Identifier) {
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
      utils.defineScriptSetupVisitor(context, nodeVisitor),
      {
        Program(node: Program) {
          const tracker = new ReferenceTracker(utils.getScope(context, node))

          // import { set } from 'vue'; set()
          const esmTraceMap = {
            vue: {
              [ReferenceTracker.ESM]: true,
              ...deletedImportApisMap
            }
          }
          // const { set } = require('vue'); set()
          const cjsTraceMap = {
            vue: {
              ...deletedImportApisMap
            }
          }

          for (const { node } of [
            ...tracker.iterateEsmReferences(esmTraceMap),
            ...tracker.iterateCjsReferences(cjsTraceMap)
          ]) {
            const refNode = node as CallExpression
            context.report({
              node: refNode.callee,
              messageId: 'deprecated'
            })
          }
        }
      }
    )
  }
}
