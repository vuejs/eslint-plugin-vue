/**
 * @author Yosuke Ota
 */
'use strict'

const { wrapCoreRule } = require('../utils')

// eslint-disable-next-line
module.exports = wrapCoreRule(
  // @ts-ignore
  require('eslint/lib/rules/no-empty-pattern')
)
