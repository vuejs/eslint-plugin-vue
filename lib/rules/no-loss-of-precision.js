/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

// eslint-disable-next-line no-invalid-meta, no-invalid-meta-docs-categories
module.exports = utils.wrapCoreRule('no-loss-of-precision', {
  applyDocument: true
})
