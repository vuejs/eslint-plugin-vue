/**
 * @author Yosuke Ota
 */
'use strict'

const { wrapStylisticOrCoreRule } = require('../utils')

// eslint-disable-next-line internal/no-invalid-meta
module.exports = wrapStylisticOrCoreRule('keyword-spacing', {
  skipDynamicArguments: true
})
