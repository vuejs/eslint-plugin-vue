/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

/*
This script updates `lib/configs/*.ts` files from rule's meta data.
*/

import fs from 'node:fs'
import path from 'node:path'
import { ESLint } from 'eslint'
import { categories } from './lib/categories.ts'
import type { Category } from './lib/categories.ts'
import type { RuleInfo } from './lib/rules.ts'

const errorCategories = new Set(['base', 'vue2-essential', 'vue3-essential'])

const extendsCategories: Record<string, string | null> = {
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

function formatRules(
  rules: RuleInfo[],
  categoryId: string,
  shouldAlwaysError: boolean
) {
  const obj = Object.fromEntries(
    rules.map((rule) => {
      let options: string | unknown[] =
        shouldAlwaysError || errorCategories.has(categoryId) ? 'error' : 'warn'
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

function formatCategory(category: Category, shouldAlwaysError = false) {
  let extendsCategoryId = extendsCategories[category.categoryId]
  if (extendsCategoryId == null) {
    return `/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
export default {
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  rules: ${formatRules(category.rules, category.categoryId, shouldAlwaysError)},
  overrides: [
    {
      files: '*.vue',
      parser: require.resolve('vue-eslint-parser')
    }
  ]
}
`
  }
  if (shouldAlwaysError && !errorCategories.has(extendsCategoryId)) {
    extendsCategoryId += '-error'
  }

  return `/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
export default {
  extends: require.resolve('./${extendsCategoryId}'),
  rules: ${formatRules(category.rules, category.categoryId, shouldAlwaysError)}
}
`
}

// Update files.
const ROOT = path.resolve(import.meta.dirname, '../lib/configs/')
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
  const linter = new ESLint({ fix: true })
  const report = await linter.lintFiles([ROOT])
  ESLint.outputFixes(report)
}

format()
