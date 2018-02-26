/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const groupBy = require('lodash/groupBy')
const rules = require('./rules')

const categoryTitles = {
  'base': 'Base Rules (Enabling Correct ESLint Parsing)',
  'essential': 'Priority A: Essential (Error Prevention)',
  'strongly-recommended': 'Priority B: Strongly Recommended (Improving Readability)',
  'recommended': 'Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)',
  'use-with-caution': 'Priority D: Use with Caution (Potentially Dangerous Patterns)'
}
const categoryIds = Object.keys(categoryTitles)
const categoryRules = groupBy(rules, (rule) => rule.meta.docs.category || 'uncategorized')

// Throw if no title is defined for a category
for (const categoryId of Object.keys(categoryRules)) {
  if (categoryId !== 'uncategorized' && !categoryTitles[categoryId]) {
    throw new Error(`Category "${categoryId}" does not have a title defined.`)
  }
}

module.exports =
  categoryIds
    .map(categoryId => ({
      categoryId,
      title: categoryTitles[categoryId],
      rules: (categoryRules[categoryId] || []).filter(rule => !rule.meta.deprecated)
    }))
    .filter(category => category.rules.length >= 1)
