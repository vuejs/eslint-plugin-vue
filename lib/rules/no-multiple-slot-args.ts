/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'
import { getScope } from '../utils/scope.ts'
import { findVariable } from '@eslint-community/eslint-utils'

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow passing multiple arguments to scoped slots',
      categories: ['vue3-recommended', 'vue2-recommended'],
      url: 'https://eslint.vuejs.org/rules/no-multiple-slot-args.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'Unexpected multiple arguments.',
      unexpectedSpread: 'Unexpected spread argument.'
    }
  },
  create(context: RuleContext) {
    /**
     * Verify the given node
     */
    function verify(node: MemberExpression | Identifier) {
      const parent = node.parent

      if (
        parent.type === 'VariableDeclarator' &&
        parent.id.type === 'Identifier'
      ) {
        // const foo = this.$scopedSlots.foo
        verifyReferences(parent.id)
        return
      }

      if (
        parent.type === 'AssignmentExpression' &&
        parent.right === node &&
        parent.left.type === 'Identifier'
      ) {
        // foo = this.$scopedSlots.foo
        verifyReferences(parent.left)
        return
      }

      if (parent.type !== 'CallExpression' || parent.arguments.includes(node)) {
        return
      }

      if (parent.arguments.length === 0) {
        return
      }
      if (parent.arguments.length > 1) {
        context.report({
          node: parent.arguments[1],
          messageId: 'unexpected'
        })
      }
      if (parent.arguments[0].type === 'SpreadElement') {
        context.report({
          node: parent.arguments[0],
          messageId: 'unexpectedSpread'
        })
      }
    }
    /**
     * Verify the references of the given node.
     */
    function verifyReferences(node: Identifier) {
      const variable = findVariable(getScope(context, node), node)
      if (!variable) {
        return
      }
      for (const reference of variable.references) {
        if (!reference.isRead()) {
          continue
        }
        const id = reference.identifier
        verify(id)
      }
    }

    return utils.defineVueVisitor(context, {
      MemberExpression(node) {
        const object = utils.skipChainExpression(node.object)
        if (object.type !== 'MemberExpression') {
          return
        }
        const name = utils.getStaticPropertyName(object)
        if (!name || (name !== '$slots' && name !== '$scopedSlots')) {
          return
        }
        if (!utils.isThis(object.object, context)) {
          return
        }
        verify(node)
      }
    })
  }
}
