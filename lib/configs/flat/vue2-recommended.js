/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
'use strict'
const config = require('./vue2-strongly-recommended.js')

const ruleLevel =
  process.env.VUE_ESLINT_ALWAYS_ERROR === 'true' ? 'error' : 'warn'

module.exports = [
  ...config,
  {
    name: 'vue/vue2-recommended/rules',
    rules: {
      'vue/attributes-order': ruleLevel,
      'vue/block-order': ruleLevel,
      'vue/no-lone-template': ruleLevel,
      'vue/no-multiple-slot-args': ruleLevel,
      'vue/no-required-prop-with-default': ruleLevel,
      'vue/no-v-html': ruleLevel,
      'vue/order-in-components': ruleLevel,
      'vue/this-in-template': ruleLevel
    }
  }
]
