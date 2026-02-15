/**
 * @author Toru Nagashima
 */
'use strict'

const { wrapStylisticOrCoreRule } = require('../utils/index.ts')

// eslint-disable-next-line internal/no-invalid-meta
module.exports = wrapStylisticOrCoreRule('space-unary-ops', {
  skipDynamicArguments: true,
  applyDocument: true
})
