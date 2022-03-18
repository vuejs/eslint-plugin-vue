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
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.
```
*/

const fs = require('fs')
const path = require('path')
const last = require('lodash/last')
const rules = require('./lib/rules')

const ROOT = path.resolve(__dirname, '../docs/rules')

const presetCategories = {
  base: null,
  essential: 'base',
  'vue3-essential': 'base',
  'strongly-recommended': 'essential',
  'vue3-strongly-recommended': 'vue3-essential',
  recommended: 'strongly-recommended',
  'vue3-recommended': 'vue3-strongly-recommended'
  // 'use-with-caution': 'recommended',
  // 'vue3-use-with-caution': 'vue3-recommended'
}

function formatItems(items) {
  if (items.length <= 2) {
    return items.join(' and ')
  }
  return `all of ${items.slice(0, -1).join(', ')} and ${last(items)}`
}

function getPresetIds(categoryIds) {
  const subsetCategoryIds = []
  for (const categoryId of categoryIds) {
    for (const subsetCategoryId in presetCategories) {
      if (presetCategories[subsetCategoryId] === categoryId) {
        subsetCategoryIds.push(subsetCategoryId)
      }
    }
  }
  if (subsetCategoryIds.length === 0) {
    return categoryIds
  }
  return [...new Set([...categoryIds, ...getPresetIds(subsetCategoryIds)])]
}

function pickSince(content) {
  const fileIntro = /^---\n(.*\n)+---\n*/g.exec(content)
  if (fileIntro) {
    const since = /since: (v\d+\.\d+\.\d+)/.exec(fileIntro[0])
    if (since) {
      return since[1]
    }
  }
  if (process.env.IN_VERSION_SCRIPT) {
    return `v${require('../package.json').version}`
  }
  return null
}

class DocFile {
  constructor(rule) {
    this.rule = rule
    this.filePath = path.join(ROOT, `${rule.name}.md`)
    this.content = fs.readFileSync(this.filePath, 'utf8')
    this.since = pickSince(this.content)
  }

  static read(rule) {
    return new DocFile(rule)
  }

  write() {
    fs.writeFileSync(this.filePath, this.content)

    return this
  }

  updateFileIntro() {
    const { ruleId, meta } = this.rule

    const fileIntro = {
      pageClass: 'rule-details',
      sidebarDepth: 0,
      title: ruleId,
      description: meta.docs.description,
      ...(this.since ? { since: this.since } : {})
    }
    const computed = `---\n${Object.entries(fileIntro)
      .map((item) => `${item[0]}: ${item[1]}`)
      .join('\n')}\n---\n`

    const fileIntroPattern = /^---\n(.*\n)+---\n*/g

    if (fileIntroPattern.test(this.content)) {
      this.content = this.content.replace(fileIntroPattern, computed)
    } else {
      this.content = `${computed}${this.content.trim()}\n`
    }

    return this
  }

  updateHeader() {
    const { ruleId, meta } = this.rule
    const title = `# ${ruleId}\n\n> ${meta.docs.description}`
    const notes = []

    if (meta.deprecated) {
      if (meta.replacedBy) {
        const replacedRules = meta.replacedBy.map(
          (name) => `[vue/${name}](${name}.md) rule`
        )
        notes.push(
          `- :warning: This rule was **deprecated** and replaced by ${formatItems(
            replacedRules
          )}.`
        )
      } else {
        notes.push(`- :warning: This rule was **deprecated**.`)
      }
    } else if (meta.docs.categories) {
      const presets = getPresetIds(meta.docs.categories).map(
        (categoryId) => `\`"plugin:vue/${categoryId}"\``
      )

      notes.push(`- :gear: This rule is included in ${formatItems(presets)}.`)
    }
    if (meta.fixable) {
      notes.push(
        '- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.'
      )
    }
    if (meta.hasSuggestions) {
      notes.push(
        '- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).'
      )
    }

    if (!this.since) {
      notes.unshift(
        `- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>`
      )
    }

    // Add an empty line after notes.
    if (notes.length >= 1) {
      notes.push('', '')
    }

    const headerPattern = /#.+\n\n*[^\n]*\n+(?:- .+\n)*\n*/
    const header = `${title}\n\n${notes.join('\n')}`
    if (headerPattern.test(this.content)) {
      this.content = this.content.replace(headerPattern, header)
    } else {
      this.content = `${header}${this.content.trim()}\n`
    }

    return this
  }

  updateCodeBlocks() {
    const { meta } = this.rule

    this.content = this.content.replace(
      /<eslint-code-block\s(:?fix[^\s]*)?\s*/g,
      `<eslint-code-block ${meta.fixable ? 'fix ' : ''}`
    )
    return this
  }

  adjustCodeBlocks() {
    // Adjust the necessary blank lines before and after the code block so that GitHub can recognize `.md`.
    this.content = this.content.replace(
      /(<eslint-code-block([\s\S]*?)>)\n+```/gm,
      '$1\n\n```'
    )
    this.content = this.content.replace(
      /```\n+<\/eslint-code-block>/gm,
      '```\n\n</eslint-code-block>'
    )
    return this
  }

  updateFooter() {
    const { name, meta } = this.rule
    const footerPattern = /## (?::mag: Implementation|:rocket: Version).+$/s
    const footer = `${
      this.since
        ? `## :rocket: Version

This rule was introduced in eslint-plugin-vue ${this.since}

`
        : ''
    }## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/${name}.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/${name}.js)
${
  meta.docs.extensionRule
    ? `
<sup>Taken with ❤️ [from ESLint core](${meta.docs.coreRuleUrl})</sup>
`
    : ''
}`
    if (footerPattern.test(this.content)) {
      this.content = this.content.replace(footerPattern, footer)
    } else {
      this.content = `${this.content.trim()}\n\n${footer}`
    }

    return this
  }

  checkHeadings() {
    const headingPattern = /^## .*$/gm

    const knownHeadings = [
      '## :book: Rule Details',
      '## :wrench: Options',
      '## :rocket: Suggestion',
      '## :mute: When Not To Use It',
      '## :couple: Related Rules',
      '## :books: Further Reading',
      '## :rocket: Version',
      '## :mag: Implementation'
    ]

    const foundHeadings = [...this.content.matchAll(headingPattern)]

    let previousHeadingIndex = -1
    for (const [heading] of foundHeadings) {
      const headingIndex = knownHeadings.indexOf(heading)

      if (headingIndex === -1) {
        throw new Error(`Unknown heading '${heading}' in '${this.filePath}'`)
      }

      if (headingIndex < previousHeadingIndex) {
        throw new Error(
          `Heading '${heading}' should be above '${knownHeadings[previousHeadingIndex]}' in '${this.filePath}'`
        )
      }

      previousHeadingIndex = headingIndex
    }

    return this
  }
}

for (const rule of rules) {
  DocFile.read(rule)
    .updateHeader()
    .updateFooter()
    .updateCodeBlocks()
    .updateFileIntro()
    .adjustCodeBlocks()
    .write()
    .checkHeadings()
}
