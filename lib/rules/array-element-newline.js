/**
 * @author alshyra
 */
'use strict'

const { wrapStylisticOrCoreRule } = require('../utils')

// eslint-disable-next-line internal/no-invalid-meta
module.exports = wrapStylisticOrCoreRule('array-element-newline', {
  skipDynamicArguments: true
})
