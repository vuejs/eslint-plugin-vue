/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const rules = require('./rules')

const categoryTitles = {
  base: {
    text: 'Base Rules (Enabling Correct ESLint Parsing)',
    vuepress: 'Base Rules (Enabling Correct ESLint Parsing)'
  },
  'vue3-essential': {
    text: 'Priority A: Essential (Error Prevention) for Vue.js 3.x',
    vuepress:
      'Priority A: Essential (Error Prevention) <badge text="for Vue.js 3.x" vertical="middle">for Vue.js 3.x</badge>'
  },
  'vue3-strongly-recommended': {
    text: 'Priority B: Strongly Recommended (Improving Readability) for Vue.js 3.x',
    vuepress:
      'Priority B: Strongly Recommended (Improving Readability) <badge text="for Vue.js 3.x" vertical="middle">for Vue.js 3.x</badge>'
  },
  'vue3-recommended': {
    text: 'Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead) for Vue.js 3.x',
    vuepress:
      'Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead) <badge text="for Vue.js 3.x" vertical="middle">for Vue.js 3.x</badge>'
  },
  'vue3-use-with-caution': {
    text: 'Priority D: Use with Caution (Potentially Dangerous Patterns) for Vue.js 3.x',
    vuepress:
      'Priority D: Use with Caution (Potentially Dangerous Patterns) <badge text="for Vue.js 3.x" vertical="middle">for Vue.js 3.x</badge>'
  },
  essential: {
    text: 'Priority A: Essential (Error Prevention) for Vue.js 2.x',
    vuepress:
      'Priority A: Essential (Error Prevention) <badge text="for Vue.js 2.x" vertical="middle" type="warn">for Vue.js 2.x</badge>'
  },
  'strongly-recommended': {
    text: 'Priority B: Strongly Recommended (Improving Readability) for Vue.js 2.x',
    vuepress:
      'Priority B: Strongly Recommended (Improving Readability) <badge text="for Vue.js 2.x" vertical="middle" type="warn">for Vue.js 2.x</badge>'
  },
  recommended: {
    text: 'Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead) for Vue.js 2.x',
    vuepress:
      'Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead) <badge text="for Vue.js 2.x" vertical="middle" type="warn">for Vue.js 2.x</badge>'
  },
  'use-with-caution': {
    text: 'Priority D: Use with Caution (Potentially Dangerous Patterns) for Vue.js 2.x',
    vuepress:
      'Priority D: Use with Caution (Potentially Dangerous Patterns) <badge text="for Vue.js 2.x" vertical="middle" type="warn">for Vue.js 2.x</badge>'
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

module.exports = categoryIds
  .map((categoryId) => ({
    categoryId,
    title: categoryTitles[categoryId],
    rules: (categoryRules[categoryId] || []).filter(
      (rule) => !rule.meta.deprecated
    )
  }))
  .filter((category) => category.rules.length >= 1)
