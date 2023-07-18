/**
 * @author dev1437
 * See LICENSE file in root directory for full license.
 */
'use strict'

const { wrapCoreRule } = require('../utils')

// eslint-disable-next-line internal/no-invalid-meta
module.exports = wrapCoreRule('multiline-ternary', {
  skipDynamicArguments: true,
  applyDocument: true
})
