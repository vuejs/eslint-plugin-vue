import vueEslintParser from 'vue-eslint-parser'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginVue from 'eslint-plugin-vue'

export default [
  {
    files: ['*.vue'],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2015
      }
    },
    plugins: {
      import: eslintPluginImport,
      vue: eslintPluginVue
    },
    rules: {
      'import/default': 'warn',
      'import/namespace': 'warn'
    },
    settings: {
      'import/extensions': ['.js', '.vue']
    }
  }
]
