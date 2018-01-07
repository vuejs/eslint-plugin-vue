/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

/*
This script updates the rule tables of `README.md` file from rule's meta data.
*/

const fs = require('fs')
const path = require('path')
const rules = require('./lib/rules')
const categories = require('./lib/categories')

// -----------------------------------------------------------------------------
const uncategorizedRules = rules.filter(rule => !rule.meta.docs.category && !rule.meta.deprecated)
const deprecatedRules = rules.filter(rule => rule.meta.deprecated)

function toRuleRow (rule) {
  const mark = `${rule.meta.fixable ? ':wrench:' : ''}${rule.meta.deprecated ? ':warning:' : ''}`
  const link = `[${rule.ruleId}](./docs/rules/${rule.name}.md)`
  const description = rule.meta.docs.description || '(no description)'

  return `| ${mark} | ${link} | ${description} |`
}

function toDeprecatedRuleRow (rule) {
  const link = `[${rule.ruleId}](./docs/rules/${rule.name}.md)`
  const replacedRules = rule.meta.docs.replacedBy || []
  const replacedBy = replacedRules
    .map(name => `[vue/${name}](./docs/rules/${name}.md)`)
    .join(', ')

  return `| ${link} | ${replacedBy || '(no replacement)'} |`
}

// -----------------------------------------------------------------------------
let rulesTableContent = categories.map(category => `
### ${category.title}

Enforce all the rules in this category, as well as all higher priority rules, with:

\`\`\`json
{
  "extends": "plugin:vue/${category.categoryId}"
}
\`\`\`

|    | Rule ID | Description |
|:---|:--------|:------------|
${category.rules.map(toRuleRow).join('\n')}
`).join('')

// -----------------------------------------------------------------------------
if (uncategorizedRules.length >= 1) {
  rulesTableContent += `
### Uncategorized

|    | Rule ID | Description |
|:---|:--------|:------------|
${uncategorizedRules.map(toRuleRow).join('\n')}
`
}

// -----------------------------------------------------------------------------
if (deprecatedRules.length >= 1) {
  rulesTableContent += `
### Deprecated

> - :warning: We're going to remove deprecated rules in the next major release. Please migrate to successor/new rules.
> - :innocent: We don't fix bugs which are in deprecated rules since we don't have enough resources.

| Rule ID | Replaced by |
|:--------|:------------|
${deprecatedRules.map(toDeprecatedRuleRow).join('\n')}
`
}

// -----------------------------------------------------------------------------
const readmeFilePath = path.resolve(__dirname, '../README.md')
fs.writeFileSync(
  readmeFilePath,
  fs.readFileSync(readmeFilePath, 'utf8').replace(
    /<!--RULES_TABLE_START-->[\s\S]*<!--RULES_TABLE_END-->/,
    `<!--RULES_TABLE_START-->\n${rulesTableContent}\n<!--RULES_TABLE_END-->`
  )
)
