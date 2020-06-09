/**
 * @author Toru Nagashima
 */
'use strict'

const { wrapCoreRule } = require('../utils')

// eslint-disable-next-line no-invalid-meta, no-invalid-meta-docs-categories
module.exports = wrapCoreRule(
  // @ts-ignore
  require('eslint/lib/rules/space-unary-ops'),
  {
    skipDynamicArguments: true
  }
)
