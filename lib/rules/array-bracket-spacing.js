/**
 * @author Toru Nagashima
 */
'use strict'

const { wrapCoreRule } = require('../utils')

// eslint-disable-next-line no-invalid-meta, no-invalid-meta-docs-categories
module.exports = wrapCoreRule(
  require('eslint/lib/rules/array-bracket-spacing'),
  { skipDynamicArguments: true }
)
