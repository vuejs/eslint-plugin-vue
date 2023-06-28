/**
 * @author Toru Nagashima
 */
'use strict'

const { wrapCoreRule } = require('../utils')

// eslint-disable-next-line internal/no-invalid-meta, internal/no-invalid-meta-docs-categories
module.exports = wrapCoreRule('space-infix-ops', {
  skipDynamicArguments: true,
  applyDocument: true
})
