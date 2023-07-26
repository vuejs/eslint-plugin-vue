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
- :no_entry_sign: This rule was **deprecated**.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.
```
*/

const fs = require('fs')
const path = require('path')
const rules = require('./lib/rules')
const removedRules = require('../lib/removed-rules')
const { getPresetIds, formatItems } = require('./lib/utils')

const ROOT = path.resolve(__dirname, '../docs/rules')

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

    this.content = fileIntroPattern.test(this.content)
      ? this.content.replace(fileIntroPattern, computed)
      : `${computed}${this.content.trim()}\n`

    return this
  }

  updateHeader() {
    const { ruleId, meta } = this.rule
    const description = meta.docs
      ? meta.docs.description
      : this.content.match(/^description: (.*)$/m)[1]
    const title = `# ${ruleId}\n\n> ${description}`
    const notes = []

    if (meta.removedInVersion) {
      if (meta.replacedBy.length > 0) {
        const replacedRules = meta.replacedBy.map(
          (name) => `[vue/${name}](${name}.md) rule`
        )
        notes.push(
          `- :no_entry: This rule was **removed** in eslint-plugin-vue ${
            meta.removedInVersion
          } and replaced by ${formatItems(replacedRules)}.`
        )
      } else {
        notes.push(
          `- :no_entry: This rule was **removed** in eslint-plugin-vue ${meta.removedInVersion}.`
        )
      }
    } else if (meta.deprecated) {
      if (meta.replacedBy) {
        const replacedRules = meta.replacedBy.map(
          (name) => `[vue/${name}](${name}.md) rule`
        )
        notes.push(
          `- :no_entry_sign: This rule was **deprecated** and replaced by ${formatItems(
            replacedRules
          )}.`
        )
      } else {
        notes.push(`- :no_entry_sign: This rule was **deprecated**.`)
      }
    }
    if (meta.docs?.categories) {
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
    if (notes.length > 0) {
      notes.push('', '')
    }

    const headerPattern = /#.+\n+[^\n]*\n+(?:- .+\n)*\n*/
    const header = `${title}\n\n${notes.join('\n')}`
    this.content = headerPattern.test(this.content)
      ? this.content.replace(headerPattern, header)
      : `${header}${this.content.trim()}\n`

    return this
  }

  updateCodeBlocks() {
    const { meta } = this.rule

    this.content = this.content.replace(
      /<eslint-code-block\s(:?fix\S*)?\s*/g,
      `<eslint-code-block ${meta.fixable ? 'fix ' : ''}`
    )
    return this
  }

  adjustCodeBlocks() {
    // Adjust the necessary blank lines before and after the code block so that GitHub can recognize `.md`.
    this.content = this.content.replace(
      /(<eslint-code-block([\S\s]*?)>)\n+```/gm,
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
    this.content = footerPattern.test(this.content)
      ? this.content.replace(footerPattern, footer)
      : `${this.content.trim()}\n\n${footer}`

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

  checkGoodBadSymbols() {
    const lines = this.content.split('\n')
    for (const [lineNumber, line] of lines.entries()) {
      const lineNumberFilePath = `${this.filePath}:${lineNumber + 1}`

      if (line.includes('GOOD') && !line.includes('✓ GOOD')) {
        throw new Error(
          `Expected '✓ GOOD' instead of '${line}' in '${lineNumberFilePath}'`
        )
      }

      if (line.includes('BAD') && !line.includes('✗ BAD')) {
        throw new Error(
          `Expected '✗ BAD' instead of '${line}' in '${lineNumberFilePath}'`
        )
      }
    }
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
    .checkGoodBadSymbols()
}

for (const { ruleName, replacedBy, removedInVersion } of removedRules) {
  const rule = {
    name: ruleName,
    ruleId: `vue/${ruleName}`,
    meta: {
      replacedBy,
      removedInVersion
    }
  }
  DocFile.read(rule).updateHeader().write()
}
