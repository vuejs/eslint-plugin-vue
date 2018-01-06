'use strict'

const resolve = require('path').resolve
const requireAll = require('require-all')

const rules = requireAll({
  dirname: resolve(__dirname, 'rules'),
  filter: /^([\w\-]+)\.js$/
})
const configs = requireAll({
  dirname: resolve(__dirname, 'config'),
  filter: /^([\w\-]+)\.js$/
})
const processor = require('./processor')

module.exports = {
  rules,
  configs,
  processors: { '.vue': processor }
}
