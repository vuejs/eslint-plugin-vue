const path = require('path')
const fs = require('fs')
const cp = require('child_process')
const logger = console

// main
;((ruleId) => {
  if (ruleId == null) {
    logger.error('Usage: npm run new <RuleID>')
    process.exitCode = 1
    return
  }
  if (!/^[\w-]+$/u.test(ruleId)) {
    logger.error("Invalid RuleID '%s'.", ruleId)
    process.exitCode = 1
    return
  }

  const ruleFile = path.resolve(__dirname, `../lib/rules/${ruleId}.js`)
  const testFile = path.resolve(__dirname, `../tests/lib/rules/${ruleId}.js`)
  const docFile = path.resolve(__dirname, `../docs/rules/${ruleId}.md`)

  fs.writeFileSync(
    ruleFile,
    `/**
 * @author *****your name*****
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

// ...

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

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
 * @author *****your name*****
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/${ruleId}')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('${ruleId}', rule, {
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
title: vue/${ruleId}
description: xxx
---
# vue/${ruleId}

> xxx

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule ....

<eslint-code-block :rules="{'vue/${ruleId}': ['error']}">

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
})(process.argv[2])
