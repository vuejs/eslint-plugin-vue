const path = require('path')
const fs = require('fs')
const cp = require('child_process')
const logger = console

// main
;((ruleName, authorName) => {
  if (!ruleName || !authorName) {
    logger.error('Usage: npm run new <rule name> <author name>')
    process.exitCode = 1
    return
  }
  if (!/^[\w-]+$/u.test(ruleName)) {
    logger.error("Invalid rule name '%s'.", ruleName)
    process.exitCode = 1
    return
  }

  const ruleFile = path.resolve(__dirname, `../lib/rules/${ruleName}.js`)
  const testFile = path.resolve(__dirname, `../tests/lib/rules/${ruleName}.js`)
  const docFile = path.resolve(__dirname, `../docs/rules/${ruleName}.md`)

  fs.writeFileSync(
    ruleFile,
    `/**
 * @author ${authorName}
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: '',
      categories: undefined,
      url: ''
    },
    fixable: null,
    schema: [],
    messages: {
      // ...
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    // ...

    return utils.defineTemplateBodyVisitor(context, {
      // ...
    })
  }
}
`
  )
  fs.writeFileSync(
    testFile,
    `/**
 * @author ${authorName}
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/${ruleName}')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('${ruleName}', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: \`
      <template>

      </template>
      \`
    },
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: \`
      <template>

      </template>
      \`,
      errors: [
        {
          message: '...',
          line: 'line',
          column: 'col'
        },
      ]
    }
  ]
})
`
  )
  fs.writeFileSync(
    docFile,
    `---
pageClass: rule-details
sidebarDepth: 0
title: vue/${ruleName}
description: xxx
---
# vue/${ruleName}

> xxx

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule ....

<eslint-code-block :rules="{'vue/${ruleName}': ['error']}">

\`\`\`vue
<template>

</template>
\`\`\`

</eslint-code-block>

## :wrench: Options

Nothing.

`
  )

  cp.execSync(`code "${ruleFile}"`)
  cp.execSync(`code "${testFile}"`)
  cp.execSync(`code "${docFile}"`)
})(process.argv[2], process.argv[3])
