/**
 * @author Flo Edelmann
 */

import wrapCoreRuleModule from '../utils/index.js'

const { wrapCoreRule } = wrapCoreRuleModule

const conditionalDirectiveNames = new Set(['v-show', 'v-if', 'v-else-if'])

// eslint-disable-next-line internal/no-invalid-meta
export default wrapCoreRule('no-constant-condition', {
  create(_context, { baseHandlers }) {
    return {
      VDirectiveKey(node) {
        if (
          conditionalDirectiveNames.has(`v-${node.name.name}`) &&
          node.parent.value &&
          node.parent.value.expression &&
          baseHandlers.IfStatement
        ) {
          baseHandlers.IfStatement({
            // @ts-expect-error -- Process expression of VExpressionContainer as IfStatement.
            test: node.parent.value.expression
          })
        }
      }
    }
  }
})
