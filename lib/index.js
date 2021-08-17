'use strict'

const requireIndex = require('requireindex')

module.exports = {
  rules: requireIndex(`${__dirname}/rules`),
  configs: requireIndex(`${__dirname}/configs`),
  processors: {
    '.vue': require('./processor')
  }
}
