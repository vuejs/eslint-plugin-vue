/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const rules = require('./rules')

const categoryTitles = {
  base: {
    text: 'Base Rules (Enabling Correct ESLint Parsing)'
  },
  'vue3-essential': {
    text: 'Priority A: Essential (Error Prevention) for Vue.js 3.x'
  },
  'vue3-strongly-recommended': {
    text: 'Priority B: Strongly Recommended (Improving Readability) for Vue.js 3.x'
  },
  'vue3-recommended': {
    text: 'Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead) for Vue.js 3.x'
  },
  'vue3-use-with-caution': {
    text: 'Priority D: Use with Caution (Potentially Dangerous Patterns) for Vue.js 3.x'
  },
  'vue2-essential': {
    text: 'Priority A: Essential (Error Prevention) for Vue.js 2.x'
  },
  'vue2-strongly-recommended': {
    text: 'Priority B: Strongly Recommended (Improving Readability) for Vue.js 2.x'
  },
  'vue2-recommended': {
    text: 'Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead) for Vue.js 2.x'
  },
  'vue2-use-with-caution': {
    text: 'Priority D: Use with Caution (Potentially Dangerous Patterns) for Vue.js 2.x'
  }
}
const categoryIds = Object.keys(categoryTitles)
const categoryRules = {}

for (const rule of rules) {
  const categories = rule.meta.docs.categories || ['uncategorized']
  for (const categoryId of categories) {
    // Throw if no title is defined for a category
    if (categoryId !== 'uncategorized' && !categoryTitles[categoryId]) {
      throw new Error(`Category "${categoryId}" does not have a title defined.`)
    }
    const catRules =
      categoryRules[categoryId] || (categoryRules[categoryId] = [])
    catRules.push(rule)
  }
}

const presetConfigNames = {
  base: 'flat/base',
  'vue3-essential': 'flat/essential',
  'vue2-essential': 'flat/vue2-essential',
  'vue3-strongly-recommended': 'flat/strongly-recommended',
  'vue2-strongly-recommended': 'flat/vue2-strongly-recommended',
  'vue3-recommended': 'flat/recommended',
  'vue2-recommended': 'flat/vue2-recommended'
}
const legacyPresetConfigNames = {
  base: 'base',
  'vue3-essential': 'essential',
  'vue2-essential': 'vue2-essential',
  'vue3-strongly-recommended': 'strongly-recommended',
  'vue2-strongly-recommended': 'vue2-strongly-recommended',
  'vue3-recommended': 'recommended',
  'vue2-recommended': 'vue2-recommended'
}

const getPresetNames = (presetIds) => [
  ...presetIds.map(
    (categoryId) => `\`*.configs["${presetConfigNames[categoryId]}"]\``
  ),
  ...presetIds.map(
    (categoryId) => `\`"plugin:vue/${legacyPresetConfigNames[categoryId]}"\``
  )
]

module.exports = {
  getPresetNames,
  categories: categoryIds
    .map((categoryId) => ({
      categoryId,
      title: categoryTitles[categoryId],
      rules: categoryRules[categoryId] || []
    }))
    .filter((category) => category.rules.length > 0)
}
