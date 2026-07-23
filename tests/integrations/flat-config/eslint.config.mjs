import plugin from 'eslint-plugin-vue'

export default [
  ...plugin.configs['flat/base'],
  {
    rules: {
      'vue/no-duplicate-attributes': 'error'
    }
  }
]
