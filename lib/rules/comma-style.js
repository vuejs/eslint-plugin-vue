/**
 * @author Yosuke Ota
 */
'use strict'

const { wrapCoreRule } = require('../utils')

// eslint-disable-next-line no-invalid-meta, no-invalid-meta-docs-categories
module.exports = wrapCoreRule(
  // @ts-ignore
  require('eslint/lib/rules/comma-style'),
  {
    create(_context, { coreHandlers }) {
      return {
        VSlotScopeExpression(node) {
          if (coreHandlers.FunctionExpression) {
            // @ts-ignore
            coreHandlers.FunctionExpression(node)
          }
        }
      }
    }
  }
)
