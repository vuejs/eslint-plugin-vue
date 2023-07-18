/**
 * @author Toru Nagashima
 */
'use strict'

const { wrapCoreRule } = require('../utils')

// eslint-disable-next-line internal/no-invalid-meta
module.exports = wrapCoreRule('space-unary-ops', {
  skipDynamicArguments: true,
  applyDocument: true
})
