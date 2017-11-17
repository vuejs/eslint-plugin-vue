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
const tablePlaceholder = /<!--RULES_TABLE_START-->[\s\S]*<!--RULES_TABLE_END-->/
const readmeContent = fs.readFileSync(readmeFile, 'utf8')

const PEN = ':wrench:'
const WARN = ':warning:'

const rules = fs.readdirSync(root)
  .filter(file => path.extname(file) === '.js')
  .map(file => path.basename(file, '.js'))
  .map(fileName => [
    fileName,
    require(path.join(root, fileName))
  ])

// In order of priority
const categories = [
  'base',
  'essential',
  'strongly-recommended',
  'recommended'
// Only include categories with existing rules
].filter(category =>
  rules.some(entry =>
    !entry[1].meta.deprecated &&
    entry[1].meta.docs.category === category
  )
)

// Throw if an invalid category has been used
for (const entry of rules) {
  const category = entry[1].meta.docs.category
  if (!categories.includes(category)) {
    categories.push('uncategorized')
    if (category) {
      throw new Error(`Rule category ${category} from ${entry[0]} is invalid`)
    }
  }
}

const categoryTitles = {
  'base': 'Base Rules (Enabling Correct ESLint Parsing)',
  'essential': 'Priority A: Essential (Error Prevention)',
  'strongly-recommended': 'Priority B: Strongly Recommended (Improving Readability)',
  'recommended': 'Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)',
  'use-with-caution': 'Priority D: Use with Caution (Potentially Dangerous Patterns)',
  'uncategorized': 'Uncategorized'
}

// Throw if no title is defined for a category
for (const category of categories) {
  if (!categoryTitles[category]) {
    throw new Error(`Category "${category}" does not have a title defined.`)
  }
}

const deprecatedRules = rules
  .filter(entry => entry[1].meta.deprecated)

let rulesTableContent = categories.map(category => `
### ${categoryTitles[category]}
${
category === 'uncategorized' ? '' : `
Enforce all the rules in this category, as well as all higher priority rules, with:

\`\`\` json
"extends": "plugin:vue/${category}"
\`\`\`
`
}
|    | Rule ID | Description |
|:---|:--------|:------------|
${
  rules
    .filter(entry =>
      (
        category === 'uncategorized' &&
        !entry[1].meta.docs.category
      ) ||
      (
        entry[1].meta.docs.category === category &&
        !entry[1].meta.deprecated
      )
    )
    .map(entry => {
      const name = entry[0]
      const meta = entry[1].meta
      const mark = `${meta.fixable ? PEN : ''}${meta.deprecated ? WARN : ''}`
      const link = `[${name}](./docs/rules/${name}.md)`
      const description = meta.docs.description || '(no description)'
      return `| ${mark} | ${link} | ${description} |`
    })
    .join('\n')
}
`).join('\n')

if (deprecatedRules.length) {
  rulesTableContent += `
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
}

categories.forEach((category, categoryIndex) => {
  if (category === 'uncategorized') return
  createRulesFile(category, categories.slice(0, categoryIndex + 1))
})

function createRulesFile (rulesGroupName, categories) {
  const enabledRules = rules.filter(entry =>
    !entry[1].meta.deprecated &&
    categories.includes(entry[1].meta.docs.category)
  ).reduce((obj, entry) => {
    obj[`vue/${entry[0]}`] = 'error'
    return obj
  }, {})

  const enabledRulesContent = `/*
* IMPORTANT!
* This file has been automatically generated,
* in order to update it's content execute "npm run update"
*/
module.exports = ${JSON.stringify(enabledRules, null, 2)}`

  fs.writeFileSync(
    readmeFile,
    readmeContent.replace(
      tablePlaceholder,
      `<!--RULES_TABLE_START-->\n${rulesTableContent}\n<!--RULES_TABLE_END-->`
    )
  )

  const enabledRulesFile = path.resolve(__dirname, `../lib/${rulesGroupName}-rules.js`)

  fs.writeFileSync(
    enabledRulesFile,
    enabledRulesContent
  )
}

/*
  * The pattern to match document header.
  * The header is one title line and zero or more unordered list items.
  * E.g.
  *
  * # description
  * - a note. (there are 3 kinds of notes: recommended, deprecated, and autofixable)
  * - another note.
  *
  */
const headerPattern = /^#[^\n]*\n+(?:- .+\n)*\n*/

// Update the header of rule documents.
const docsRoot = path.resolve(__dirname, '../docs/rules')
for (const entry of rules) {
  const ruleId = entry[0]
  const meta = entry[1].meta
  const filePath = path.join(docsRoot, `${ruleId}.md`)
  const autofix = meta.fixable ? `- ${PEN} The \`--fix\` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.\n` : ''
  let deprecated = meta.deprecated ? `- ${WARN} This rule was **deprecated**` : ''
  deprecated += meta.deprecated && meta.docs.replacedBy ? ` and replaced by ${meta.docs.replacedBy.map(id => `[${id}](${id}.md) rule`).join(', ')}.` : ''
  const header = `# ${meta.docs.description} (${ruleId})\n\n${deprecated ? deprecated + '\n' : ''}${autofix ? autofix + '\n' : ''}`

  fs.writeFileSync(
    filePath,
    fs.readFileSync(filePath, 'utf8').replace(headerPattern, header)
  )
}
