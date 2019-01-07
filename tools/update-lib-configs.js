/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

/*
This script updates `lib/configs/*.js` files from rule's meta data.
*/

const fs = require('fs')
const path = require('path')
const eslint = require('eslint')
const categories = require('./lib/categories')

const errorCategories = ['base', 'essential']

function formatRules (rules) {
  const obj = rules.reduce((setting, rule) => {
    setting[rule.ruleId] = errorCategories.includes(rule.meta.docs.category) ? 'error' : 'warn'
    return setting
  }, {})
  return JSON.stringify(obj, null, 2)
}

function formatCategory (category, prevCategory) {
  if (prevCategory == null) {
    return `/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update it's content execute "npm run update"
 */
module.exports = {
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    }
  },
  env: {
    browser: true,
    es6: true
  },
  plugins: [
    'vue'
  ],
  rules: ${formatRules(category.rules)}
}
`
  }
  return `/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update it's content execute "npm run update"
 */
module.exports = {
  extends: require.resolve('./${prevCategory.categoryId}'),
  rules: ${formatRules(category.rules)}
}
`
}

// Update files.
const ROOT = path.resolve(__dirname, '../lib/configs/')
categories.forEach((category, index) => {
  const filePath = path.join(ROOT, `${category.categoryId}.js`)
  const content = formatCategory(category, categories[index - 1])

  fs.writeFileSync(filePath, content)
})

// Format files.
const linter = new eslint.CLIEngine({ fix: true })
const report = linter.executeOnFiles([ROOT])
eslint.CLIEngine.outputFixes(report)
