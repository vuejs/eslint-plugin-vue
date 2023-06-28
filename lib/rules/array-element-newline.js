/**
 * @author alshyra
 */
'use strict'

const { wrapCoreRule } = require('../utils')

// eslint-disable-next-line internal/no-invalid-meta, internal/no-invalid-meta-docs-categories
module.exports = wrapCoreRule('array-element-newline', {
  skipDynamicArguments: true
})
