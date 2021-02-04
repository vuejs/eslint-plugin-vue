/**
 * @author Flo Edelmann
 */
'use strict'

const { wrapCoreRule } = require('../utils')

const conditionalDirectiveNames = new Set(['v-show', 'v-if', 'v-else-if'])

// eslint-disable-next-line no-invalid-meta, no-invalid-meta-docs-categories
module.exports = wrapCoreRule('no-constant-condition', {
  create(_context, { coreHandlers }) {
    return {
      VDirectiveKey(node) {
        if (
          conditionalDirectiveNames.has(`v-${node.name.name}`) &&
          node.parent.value &&
          node.parent.value.expression &&
          coreHandlers.IfStatement
        ) {
          coreHandlers.IfStatement({
            // @ts-expect-error -- Process expression of VExpressionContainer as IfStatement.
            test: node.parent.value.expression
          })
        }
      }
    }
  }
})
