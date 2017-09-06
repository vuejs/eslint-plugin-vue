/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const fs = require('fs')
const path = require('path')

// ------------------------------------------------------------------------------
// Main
// ------------------------------------------------------------------------------

const root = path.resolve(__dirname, '../lib/rules')
const readmeFile = path.resolve(__dirname, '../README.md')
const recommendedRulesFile = path.resolve(__dirname, '../lib/recommended-rules.js')
const tablePlaceholder = /<!--RULES_TABLE_START-->[\s\S]*<!--RULES_TABLE_END-->/
const readmeContent = fs.readFileSync(readmeFile, 'utf8')

const STAR = ':white_check_mark:'
const PEN = ':wrench:'
const WARN = ':warning:'

const rules = fs.readdirSync(root)
  .filter(file => path.extname(file) === '.js')
  .map(file => path.basename(file, '.js'))
  .map(fileName => [
    fileName,
    require(path.join(root, fileName))
  ])

const categories = rules
  .map(entry => entry[1].meta.docs.category)
  .reduce((arr, category) => {
    if (!arr.includes(category)) {
      arr.push(category)
    }
    return arr
  }, ['Possible Errors', 'Best Practices', 'Stylistic Issues'])

const rulesTableContent = categories.map(category => `
### ${category}

|    | Rule ID | Description |
|:---|:--------|:------------|
${
  rules
    .filter(entry => entry[1].meta.docs.category === category && !entry[1].meta.deprecated)
    .map(entry => {
      const name = entry[0]
      const meta = entry[1].meta
      const mark = `${meta.docs.recommended ? STAR : ''}${meta.fixable ? PEN : ''}${meta.deprecated ? WARN : ''}`
      const link = `[${name}](./docs/rules/${name}.md)`
      const description = meta.docs.description || '(no description)'
      return `| ${mark} | ${link} | ${description} |`
    })
    .join('\n')
}
`).join('\n') + `
### Deprecated

> - :warning: We're going to remove deprecated rules in the next major release. Please migrate to successor/new rules.
> - :innocent: We don't fix bugs which are in deprecated rules since we don't have enough resources.

| Rule ID | Replaced by |
|:--------|:------------|
${
  rules
    .filter(entry => entry[1].meta.deprecated)
    .map(entry => {
      const name = entry[0]
      const meta = entry[1].meta
      const link = `[${name}](./docs/rules/${name}.md)`
      const replacedBy = (meta.docs.replacedBy || []).map(id => `[${id}](./docs/rules/${id}.md)`).join(', ') || '(no replacement)'
      return `| ${link} | ${replacedBy} |`
    })
    .join('\n')
}
`

const recommendedRules = rules.reduce((obj, entry) => {
  const name = `vue/${entry[0]}`
  const recommended = entry[1].meta.docs.recommended
  const status = recommended ? 'error' : 'off'
  obj[name] = status
  return obj
}, {})

const recommendedRulesContent = `/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update it's content execute "npm run update"
 */
module.exports = ${JSON.stringify(recommendedRules, null, 2)}`

fs.writeFileSync(
  readmeFile,
  readmeContent.replace(
    tablePlaceholder,
    `<!--RULES_TABLE_START-->\n${rulesTableContent}\n<!--RULES_TABLE_END-->`
  )
)

fs.writeFileSync(
  recommendedRulesFile,
  recommendedRulesContent
)
