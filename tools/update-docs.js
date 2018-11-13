/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

/*
This script updates the header of `docs/rules/*.md` from rule's meta data.
For example:

```md
# rule description (vue/rule-name)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :warning: This rule was **deprecated**.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.
```
*/

const fs = require('fs')
const path = require('path')
const last = require('lodash/last')
const rules = require('./lib/rules')
const categories = require('./lib/categories')

const ROOT = path.resolve(__dirname, '../docs/rules')

function formatItems (items) {
  if (items.length <= 2) {
    return items.join(' and ')
  }
  return `all of ${items.slice(0, -1).join(', ')} and ${last(items)}`
}

class DocFile {
  constructor (rule) {
    this.rule = rule
    this.filePath = path.join(ROOT, `${rule.name}.md`)
    this.content = fs.readFileSync(this.filePath, 'utf8')
  }

  static read (rule) {
    return new DocFile(rule)
  }

  write () {
    fs.writeFileSync(this.filePath, this.content)
  }

  updateHeader () {
    const { ruleId, meta } = this.rule
    const categoryIndex = categories.findIndex(category => category.categoryId === meta.docs.category)
    const title = `# ${meta.docs.description} (${ruleId})`
    const notes = []

    if (categoryIndex >= 0) {
      const presets = categories.slice(categoryIndex).map(category => `\`"plugin:vue/${category.categoryId}"\``)
      notes.push(`- :gear: This rule is included in ${formatItems(presets)}.`)
    }
    if (meta.deprecated) {
      if (meta.docs.replacedBy) {
        const replacedRules = meta.docs.replacedBy.map(name => `[vue/${name}](${name}.md) rule`)
        notes.push(`- :warning: This rule was **deprecated** and replaced by ${formatItems(replacedRules)}.`)
      } else {
        notes.push(`- :warning: This rule was **deprecated**.`)
      }
    }
    if (meta.fixable) {
      notes.push(`- :wrench: The \`--fix\` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.`)
    }

    // Add an empty line after notes.
    if (notes.length >= 1) {
      notes.push('', '')
    }

    const headerPattern = /^#[^\n]*\n+(?:- .+\n)*\n*/
    const header = `${title}\n\n${notes.join('\n')}`
    if (headerPattern.test(this.content)) {
      this.content = this.content.replace(headerPattern, header)
    } else {
      this.content = `${header}${this.content.trim()}\n`
    }

    return this
  }

  updateCodeBlocks () {
    const { meta } = this.rule

    this.content = this.content.replace(
      /<eslint-code-block\s(:?fix[^\s]*)?\s*/g,
      `<eslint-code-block ${meta.fixable ? 'fix ' : ''}`
    )
    return this
  }

  updateFooter () {
    const { name } = this.rule
    const footerPattern = /## :mag: Implementation.+$/s
    const footer = `## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/${name}.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/${name}.js)
`
    if (footerPattern.test(this.content)) {
      this.content = this.content.replace(footerPattern, footer)
    } else {
      this.content = `${this.content.trim()}\n\n${footer}`
    }

    return this
  }
}

for (const rule of rules) {
  DocFile
    .read(rule)
    .updateHeader()
    .updateFooter()
    .updateCodeBlocks()
    .write()
}
