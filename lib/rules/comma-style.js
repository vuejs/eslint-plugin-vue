/**
 * @author Yosuke Ota
 */
'use strict'

const { wrapCoreRule } = require('../utils')

// eslint-disable-next-line internal/no-invalid-meta
module.exports = wrapCoreRule('comma-style', {
  create(_context, { coreHandlers }) {
    return {
      VSlotScopeExpression(node) {
        if (coreHandlers.FunctionExpression) {
          // @ts-expect-error -- Process params of VSlotScopeExpression as FunctionExpression.
          coreHandlers.FunctionExpression(node)
        }
      }
    }
  }
})
