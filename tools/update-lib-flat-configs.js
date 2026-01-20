/**
 * @author 唯然<weiran.zsd@outlook.com>
 * @copyright 2023- 唯然. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

/*
This script updates `lib/configs/flat/*.js` files from rule's meta data.
*/

const fs = require('fs')
const path = require('path')
const { FlatESLint } = require('eslint/use-at-your-own-risk')
const { categories } = require('./lib/categories')

const errorCategories = new Set(['base', 'vue2-essential', 'vue3-essential'])

const extendsCategories = {
  base: null,
  'vue2-essential': 'base',
  'vue3-essential': 'base',
  'vue2-strongly-recommended': 'vue2-essential',
  'vue3-strongly-recommended': 'vue3-essential',
  'vue2-recommended': 'vue2-strongly-recommended',
  'vue3-recommended': 'vue3-strongly-recommended',
  'vue2-use-with-caution': 'vue2-recommended',
  'vue3-use-with-caution': 'vue3-recommended'
}

function formatRules(rules, categoryId, alwaysError) {
  const obj = Object.fromEntries(
    rules.map((rule) => {
      let options =
        alwaysError || errorCategories.has(categoryId) ? 'error' : 'warn'
      const defaultOptions =
        rule.meta && rule.meta.docs && rule.meta.docs.defaultOptions
      if (defaultOptions) {
        const v = categoryId.startsWith('vue3') ? 3 : 2
        const defaultOption = defaultOptions[`vue${v}`]
        if (defaultOption) {
          options = [options, ...defaultOption]
        }
      }
      return [rule.ruleId, options]
    })
  )
  return JSON.stringify(obj, null, 2)
}

function formatCategory(category, alwaysError = false) {
  let extendsCategoryId = extendsCategories[category.categoryId]

  if (category.categoryId === 'base') {
    return `/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
import plugin from '../../plugin.ts'
import vueParser from 'vue-eslint-parser'

export default [
  {
    name: 'vue/base/setup',
    plugins: {
      get vue() {
        return plugin
      }
    },
    languageOptions: {
      sourceType: 'module',
    }
  },
  {
    name: 'vue/base/setup-for-vue',
    files: ['*.vue', '**/*.vue'],
    plugins: {
      get vue() {
        return plugin
      }
    },
    languageOptions: {
      parser: vueParser,
      sourceType: 'module',
    },
    rules: ${formatRules(category.rules, category.categoryId, alwaysError)},
    processor: 'vue/vue'
  }
]
`
  }

  if (alwaysError && !errorCategories.has(extendsCategoryId)) {
    extendsCategoryId += '-error'
  }

  return `/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
import config from './${extendsCategoryId}.ts'

export default [
  ...config,
  {
    name: 'vue/${category.categoryId.replace(/^vue3-/u, '')}${alwaysError ? '-error' : ''}/rules',
    rules: ${formatRules(category.rules, category.categoryId, alwaysError)},
  }
]
`
}

// Update files.
const ROOT = path.resolve(__dirname, '../lib/configs/flat/')
for (const category of categories) {
  const filePath = path.join(ROOT, `${category.categoryId}.ts`)
  const content = formatCategory(category)

  fs.writeFileSync(filePath, content)

  if (!errorCategories.has(category.categoryId)) {
    fs.writeFileSync(
      path.join(ROOT, `${category.categoryId}-error.ts`),
      formatCategory(category, true)
    )
  }
}

// Format files.
async function format() {
  const linter = new FlatESLint({ fix: true })
  const report = await linter.lintFiles([ROOT])
  FlatESLint.outputFixes(report)
}

format()
