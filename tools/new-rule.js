const path = require('node:path')
const fs = require('node:fs')
const cp = require('node:child_process')
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

  const ruleFile = path.resolve(__dirname, `../lib/rules/${ruleName}.ts`)
  const testFile = path.resolve(
    __dirname,
    `../tests/lib/rules/${ruleName}.test.ts`
  )
  const docFile = path.resolve(__dirname, `../docs/rules/${ruleName}.md`)

  fs.writeFileSync(
    ruleFile,
    `/**
 * @author ${authorName}
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

export default {
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
  create(context: RuleContext) {
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
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/${ruleName}'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
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

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

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
