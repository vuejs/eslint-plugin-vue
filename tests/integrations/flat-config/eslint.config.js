const plugin = require('eslint-plugin-vue')
module.exports = [
  ...plugin.configs['flat/base'],
  {
    rules: {
      'vue/no-duplicate-attributes': 'error'
    }
  }
]
