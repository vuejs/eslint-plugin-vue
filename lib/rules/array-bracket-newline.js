/**
 * @author Yosuke Ota
 */
'use strict'

const { wrapCoreRule } = require('../utils')

// eslint-disable-next-line internal/no-invalid-meta, internal/no-invalid-meta-docs-categories
module.exports = wrapCoreRule('array-bracket-newline', {
  skipDynamicArguments: true
})
