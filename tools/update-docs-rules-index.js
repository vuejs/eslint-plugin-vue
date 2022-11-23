/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
'use strict'

const fs = require('fs')
const path = require('path')
const rules = require('./lib/rules')
const { getPresetIds, formatItems } = require('./lib/utils')
const removedRules = require('../lib/removed-rules')

const VUE3_EMOJI = ':three:'
const VUE2_EMOJI = ':two:'

// -----------------------------------------------------------------------------
const categorizedRules = rules.filter(
  (rule) =>
    rule.meta.docs.categories &&
    !rule.meta.docs.extensionRule &&
    !rule.meta.deprecated
)
const uncategorizedRules = rules.filter(
  (rule) =>
    !rule.meta.docs.categories &&
    !rule.meta.docs.extensionRule &&
    !rule.meta.deprecated
)
const uncategorizedExtensionRule = rules.filter(
  (rule) =>
    !rule.meta.docs.categories &&
    rule.meta.docs.extensionRule &&
    !rule.meta.deprecated
)
const deprecatedRules = rules.filter((rule) => rule.meta.deprecated)

const TYPE_MARK = {
  problem: ':warning:',
  suggestion: ':hammer:',
  layout: ':lipstick:'
}

function toRuleRow(rule, kindMarks = []) {
  const mark = [
    rule.meta.fixable ? ':wrench:' : '',
    rule.meta.hasSuggestions ? ':bulb:' : '',
    rule.meta.deprecated ? ':warning:' : ''
  ].join('')
  const kindMark = [...kindMarks, TYPE_MARK[rule.meta.type]].join('')
  const link = `[${rule.ruleId}](./${rule.name}.md)`
  const description = rule.meta.docs.description || '(no description)'

  return `| ${link} | ${description} | ${mark} | ${kindMark} |`
}

function toDeprecatedRuleRow(rule) {
  const link = `[${rule.ruleId}](./${rule.name}.md)`
  const replacedRules = rule.meta.replacedBy || []
  const replacedBy = replacedRules
    .map((name) => `[vue/${name}](./${name}.md)`)
    .join(', ')

  return `| ${link} | ${replacedBy || '(no replacement)'} |`
}

function toRemovedRuleRow({
  ruleName,
  replacedBy,
  deprecatedInVersion,
  removedInVersion
}) {
  const link = `[vue/${ruleName}](./${ruleName}.md)`
  const replacement =
    replacedBy.map((name) => `[vue/${name}](./${name}.md)`).join(', ') ||
    '(no replacement)'
  const deprecatedVersionLink = `[${deprecatedInVersion}](https://github.com/vuejs/eslint-plugin-vue/releases/tag/${deprecatedInVersion})`
  const removedVersionLink = `[${removedInVersion}](https://github.com/vuejs/eslint-plugin-vue/releases/tag/${removedInVersion})`

  return `| ${link} | ${replacement} | ${deprecatedVersionLink} | ${removedVersionLink} |`
}

const categoryGroups = [
  {
    title: 'Base Rules (Enabling Correct ESLint Parsing)',
    description:
      'Rules in this category are enabled for all presets provided by eslint-plugin-vue.',
    categoryIdForVue3: 'base',
    categoryIdForVue2: 'base',
    useMark: false
  },
  {
    title: 'Priority A: Essential (Error Prevention)',
    categoryIdForVue3: 'vue3-essential',
    categoryIdForVue2: 'essential',
    useMark: true
  },
  {
    title: 'Priority B: Strongly Recommended (Improving Readability)',
    categoryIdForVue3: 'vue3-strongly-recommended',
    categoryIdForVue2: 'strongly-recommended',
    useMark: true
  },
  {
    title: 'Priority C: Recommended (Potentially Dangerous Patterns)',
    categoryIdForVue3: 'vue3-recommended',
    categoryIdForVue2: 'recommended',
    useMark: true
  }
]

// -----------------------------------------------------------------------------
let rulesTableContent = categoryGroups
  .map((group) => {
    const rules = categorizedRules.filter(
      (rule) =>
        rule.meta.docs.categories.includes(group.categoryIdForVue3) ||
        rule.meta.docs.categories.includes(group.categoryIdForVue2)
    )
    let content = `
## ${group.title}
`

    if (group.description) {
      content += `
${group.description}
`
    }
    if (group.useMark) {
      const presetsForVue3 = getPresetIds([group.categoryIdForVue3]).map(
        (categoryId) => `\`"plugin:vue/${categoryId}"\``
      )
      const presetsForVue2 = getPresetIds([group.categoryIdForVue2]).map(
        (categoryId) => `\`"plugin:vue/${categoryId}"\``
      )
      content += `
- ${VUE3_EMOJI} Indicates that the rule is for Vue 3 and is included in ${formatItems(
        presetsForVue3,
        ['preset', 'presets']
      )}.
- ${VUE2_EMOJI} Indicates that the rule is for Vue 2 and is included in ${formatItems(
        presetsForVue2,
        ['preset', 'presets']
      )}.
`
    }

    content += `
<rules-table>

| Rule ID | Description |    |    |
|:--------|:------------|:--:|:--:|
${rules
  .map((rule) => {
    const mark = group.useMark
      ? [
          rule.meta.docs.categories.includes(group.categoryIdForVue3)
            ? [VUE3_EMOJI]
            : [],
          rule.meta.docs.categories.includes(group.categoryIdForVue2)
            ? [VUE2_EMOJI]
            : []
        ].flat()
      : []
    return toRuleRow(rule, mark)
  })
  .join('\n')}

</rules-table>
`

    return content
  })
  .join('')

// -----------------------------------------------------------------------------
if (uncategorizedRules.length > 0 || uncategorizedExtensionRule.length > 0) {
  rulesTableContent += `
## Uncategorized

No preset enables the rules in this category.
Please enable each rule if you want.

For example:

\`\`\`json
{
  "rules": {
    "${
      (uncategorizedRules[0] || uncategorizedExtensionRule[0]).ruleId
    }": "error"
  }
}
\`\`\`
`
}
if (uncategorizedRules.length > 0) {
  rulesTableContent += `
<rules-table>

| Rule ID | Description |    |    |
|:--------|:------------|:--:|:--:|
${uncategorizedRules.map((rule) => toRuleRow(rule)).join('\n')}

</rules-table>
`
}
if (uncategorizedExtensionRule.length > 0) {
  rulesTableContent += `
### Extension Rules

The following rules extend the rules provided by ESLint itself and apply them to the expressions in the \`<template>\`.

<rules-table>

| Rule ID | Description |    |    |
|:--------|:------------|:--:|:--:|
${uncategorizedExtensionRule.map((rule) => toRuleRow(rule)).join('\n')}

</rules-table>
`
}

// -----------------------------------------------------------------------------
if (deprecatedRules.length > 0) {
  rulesTableContent += `
## Deprecated

- :warning: We're going to remove deprecated rules in the next major release. Please migrate to successor/new rules.
- :innocent: We don't fix bugs which are in deprecated rules since we don't have enough resources.

| Rule ID | Replaced by |
|:--------|:------------|
${deprecatedRules.map(toDeprecatedRuleRow).join('\n')}
`
}

// -----------------------------------------------------------------------------
rulesTableContent += `
## Removed

- :no_entry_sign: These rules have been removed in a previous major release, after they have been deprecated for a while.

| Rule ID | Replaced by | Deprecated in version  | Removed in version |
|:--------|:------------|:-----------------------|:-------------------|
${removedRules.map(toRemovedRuleRow).join('\n')}
`

// -----------------------------------------------------------------------------
const readmeFilePath = path.resolve(__dirname, '../docs/rules/index.md')
fs.writeFileSync(
  readmeFilePath,
  `---
sidebarDepth: 0
pageClass: rule-list
---

# Available rules

<!-- This file is automatically generated in tools/update-docs-rules-index.js, do not change! -->

::: tip Legend
  :wrench: Indicates that the rule is fixable, and using \`--fix\` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the reported problems.

  :bulb: Indicates that some problems reported by the rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).
:::

Mark indicating rule type:

- <span class="emoji">:warning:</span> Possible Problems: These rules relate to possible logic errors in code.
- :hammer: Suggestions: These rules suggest alternate ways of doing things.
- :lipstick: Layout & Formatting: These rules care about how the code looks rather than how it executes.

${rulesTableContent.trim()}
`
)
