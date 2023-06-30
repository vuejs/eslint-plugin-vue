/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const { wrapCoreRule } = require('../utils')

// eslint-disable-next-line internal/no-invalid-meta, internal/no-invalid-meta-docs-categories
module.exports = wrapCoreRule('object-shorthand', {
  skipDynamicArguments: true
})
