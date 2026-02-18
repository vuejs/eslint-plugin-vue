/**
 * @author lozinsky <https://github.com/lozinsky>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const { wrapCoreRule } = require('../utils/index.ts')

// eslint-disable-next-line internal/no-invalid-meta
module.exports = wrapCoreRule('no-implicit-coercion', {
  applyDocument: true
})
