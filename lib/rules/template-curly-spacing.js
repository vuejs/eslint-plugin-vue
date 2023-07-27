/**
 * @author Yosuke Ota
 */
'use strict'

const { wrapCoreRule } = require('../utils')

// eslint-disable-next-line internal/no-invalid-meta
module.exports = wrapCoreRule('template-curly-spacing', {
  skipDynamicArguments: true,
  applyDocument: true
})
