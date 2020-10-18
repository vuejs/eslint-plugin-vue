/**
 * @author Yosuke Ota
 */
'use strict'

const { wrapCoreRule } = require('../utils')

// eslint-disable-next-line no-invalid-meta, no-invalid-meta-docs-categories
module.exports = wrapCoreRule('space-in-parens', {
  skipDynamicArguments: true,
  skipDynamicArgumentsReport: true
})
