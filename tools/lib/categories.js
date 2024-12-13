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

const CONFIG_NAME_CAPTIONS = {
  base: ['"plugin:vue/base"', '*.configs["flat/base"]'],
  'vue3-essential': ['"plugin:vue/essential"', '*.configs["flat/essential"]'],
  'vue2-essential': [
    '"plugin:vue/vue2-essential"',
    '*.configs["flat/vue2-essential"]'
  ],
  'vue3-strongly-recommended': [
    '"plugin:vue/strongly-recommended"',
    '*.configs["flat/strongly-recommended"]'
  ],
  'vue2-strongly-recommended': [
    '"plugin:vue/vue2-strongly-recommended"',
    '*.configs["flat/vue2-strongly-recommended"]'
  ],
  'vue3-recommended': [
    '"plugin:vue/recommended"',
    '*.configs["flat/recommended"]'
  ],
  'vue2-recommended': [
    '"plugin:vue/vue2-recommended"',
    '*.configs["flat/vue2-recommended"]'
  ]
}

module.exports = {
  CONFIG_NAME_CAPTIONS,
  categories: categoryIds
    .map((categoryId) => ({
      categoryId,
      title: categoryTitles[categoryId],
      rules: categoryRules[categoryId] || []
    }))
    .filter((category) => category.rules.length > 0)
}
