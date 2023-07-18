/**
 * @author alshyra
 */
'use strict'

const { wrapCoreRule } = require('../utils')

// eslint-disable-next-line internal/no-invalid-meta
module.exports = wrapCoreRule('array-element-newline', {
  skipDynamicArguments: true
})
