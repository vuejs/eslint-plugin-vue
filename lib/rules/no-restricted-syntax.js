/**
 * @author Yosuke Ota
 */
'use strict'

const { wrapCoreRule } = require('../utils/index.ts')

// eslint-disable-next-line internal/no-invalid-meta
module.exports = wrapCoreRule('no-restricted-syntax', {
  applyDocument: true
})
