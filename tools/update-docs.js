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

function formatItems (items) {
  if (items.length <= 2) {
    return items.join(' and ')
  }
  return `all of ${items.slice(0, -1).join(', ')} and ${last(items)}`
}

const ROOT = path.resolve(__dirname, '../docs/rules')
for (const rule of rules) {
  const filePath = path.join(ROOT, `${rule.name}.md`)
  const categoryIndex = categories.findIndex(category => category.categoryId === rule.meta.docs.category)
  const title = `# ${rule.meta.docs.description} (${rule.ruleId})`
  const notes = []

  if (categoryIndex >= 0) {
    const presets = categories.slice(categoryIndex).map(category => `\`"plugin:vue/${category.categoryId}"\``)
    notes.push(`- :gear: This rule is included in ${formatItems(presets)}.`)
  }
  if (rule.meta.deprecated) {
    if (rule.meta.docs.replacedBy) {
      const replacedRules = rule.meta.docs.replacedBy.map(name => `[vue/${name}](${name}.md) rule`)
      notes.push(`- :warning: This rule was **deprecated** and replaced by ${formatItems(replacedRules)}.`)
    } else {
      notes.push(`- :warning: This rule was **deprecated**.`)
    }
  }
  if (rule.meta.fixable) {
    notes.push(`- :wrench: The \`--fix\` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.`)
  }

  // Add an empty line after notes.
  if (notes.length >= 1) {
    notes.push('', '')
  }

  fs.writeFileSync(
    filePath,
    fs.readFileSync(filePath, 'utf8').replace(
      /^#[^\n]*\n+(?:- .+\n)*\n*/,
      `${title}\n\n${notes.join('\n')}`
    )
  )
}
