'use strict'

const resolve = require('path').resolve
const requireIndex = require('requireindex')

const rules = requireIndex(resolve(__dirname, 'lib/rules'))
const configs = requireIndex(resolve(__dirname, 'config'))

module.exports = {
  rules,
  configs
}
