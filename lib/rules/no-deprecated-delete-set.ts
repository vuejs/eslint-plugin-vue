/**
 * @author Wayne Zhang
 * See LICENSE file in root directory for full license.
 */
import type { TYPES } from '@eslint-community/eslint-utils'
import type { VueVisitor } from '../utils/index.js'
import utils from '../utils/index.js'
import { getScope } from '../utils/scope.ts'
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

      return undefined
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
    } satisfies VueVisitor

    return utils.compositingVisitors(
      utils.defineVueVisitor(context, nodeVisitor),
      utils.defineScriptSetupVisitor(context, nodeVisitor),
      {
        Program(node) {
          const tracker = new ReferenceTracker(getScope(context, node))

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
