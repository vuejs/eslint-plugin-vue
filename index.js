'use strict'

require('eslint-plugin-html')

module.exports = {
  settings: {
    'html/html-extensions': ['.vue'],
    'html/xml-extensions': []
  },
  rules: {
    'jsx-uses-vars': require('eslint-plugin-react/lib/rules/jsx-uses-vars')
  }
}
