'use strict'

const configs = require('./configs')
const plugin = require('./plugin')

module.exports = Object.assign(plugin, { configs })
