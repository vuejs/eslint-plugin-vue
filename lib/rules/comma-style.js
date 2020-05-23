/**
 * @author Yosuke Ota
 */
'use strict'

const { wrapCoreRule } = require('../utils')

// eslint-disable-next-line no-invalid-meta, no-invalid-meta-docs-categories
module.exports = wrapCoreRule(
  require('eslint/lib/rules/comma-style'),
  {
    create (_context, { coreHandlers }) {
      return {
        VSlotScopeExpression (node) {
          coreHandlers.FunctionExpression(node)
        }
      }
    }
  }
)
