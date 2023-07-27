/**
 * @author Toru Nagashima
 */
'use strict'

const { wrapCoreRule } = require('../utils')

// eslint-disable-next-line internal/no-invalid-meta
module.exports = wrapCoreRule('key-spacing', {
  skipDynamicArguments: true
})
