/**
 * @fileoverview flat config - unlike eslintrc configs, it's not auto generated.
 * @author 唯然<weiran.zsd@outlook.com>
 */

const config = require('./vue2-strongly-recommended.js')
const { extendsRules } = require('../../utils/config-helpers.js')

const rules = {
  'vue/attributes-order': 'warn',
  'vue/component-tags-order': 'warn',
  'vue/no-lone-template': 'warn',
  'vue/no-multiple-slot-args': 'warn',
  'vue/no-v-html': 'warn',
  'vue/order-in-components': 'warn',
  'vue/this-in-template': 'warn'
}

module.exports = extendsRules(config, rules)
