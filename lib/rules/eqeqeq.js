/**
 * @author Toru Nagashima
 */
'use strict'

const { wrapCoreRule } = require('../utils/index.ts')

// eslint-disable-next-line internal/no-invalid-meta
module.exports = wrapCoreRule('eqeqeq', {
  applyDocument: true
})
