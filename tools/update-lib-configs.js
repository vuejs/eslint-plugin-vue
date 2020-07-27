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

const errorCategories = ['base', 'essential', 'vue3-essential']

const extendsCategories = {
  base: null,
  essential: 'base',
  'vue3-essential': 'base',
  'strongly-recommended': 'essential',
  'vue3-strongly-recommended': 'vue3-essential',
  recommended: 'strongly-recommended',
  'vue3-recommended': 'vue3-strongly-recommended',
  'use-with-caution': 'recommended',
  'vue3-use-with-caution': 'vue3-recommended'
}

function formatRules(rules, categoryId) {
  const obj = rules.reduce((setting, rule) => {
    setting[rule.ruleId] = errorCategories.includes(categoryId)
      ? 'error'
      : 'warn'
    return setting
  }, {})
  return JSON.stringify(obj, null, 2)
}

function formatCategory(category) {
  const extendsCategoryId = extendsCategories[category.categoryId]
  if (extendsCategoryId == null) {
    return `/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update it's content execute "npm run update"
 */
module.exports = {
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    browser: true,
    es6: true
  },
  plugins: [
    'vue'
  ],
  rules: ${formatRules(category.rules, category.categoryId)}
}
`
  }
  return `/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update it's content execute "npm run update"
 */
module.exports = {
  extends: require.resolve('./${extendsCategoryId}'),
  rules: ${formatRules(category.rules, category.categoryId)}
}
`
}

// Update files.
const ROOT = path.resolve(__dirname, '../lib/configs/')
categories.forEach((category) => {
  const filePath = path.join(ROOT, `${category.categoryId}.js`)
  const content = formatCategory(category)

  fs.writeFileSync(filePath, content)
})

// Format files.
async function format() {
  const linter = new eslint.ESLint({ fix: true })
  const report = await linter.lintFiles([ROOT])
  eslint.ESLint.outputFixes(report)
}

format()
