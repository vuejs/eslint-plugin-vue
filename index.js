'use strict'

module.exports = {
  processors: {
    '.vue': require('eslint-plugin-html').processors['.vue']
  },
  rules: {
    'jsx-uses-vars': require('eslint-plugin-react/lib/rules/jsx-uses-vars')
  }
}
