/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

/*
This script updates `lib/plugin.js` file from rule's meta data.
*/

const fs = require('node:fs')
const path = require('node:path')
const { FlatESLint } = require('eslint/use-at-your-own-risk')
const rules = require('./lib/rules')

function camelCase(str) {
  return str.replaceAll(/-([a-z])/g, (match, letter) => letter.toUpperCase())
}

// Update files.
const filePath = path.resolve(__dirname, '../lib/plugin.ts')
const content = `/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
import meta from './meta.ts'
import processor from './processor.ts'
${rules
  .map(
    (rule) => `import ${camelCase(rule.name)} from './rules/${rule.name}.js'`
  )
  .join('\n')}

export default {
  meta,
  rules: {
    ${rules.map((rule) => `'${rule.name}': ${camelCase(rule.name)}`).join(',\n')}
  },
  processors: {
    '.vue': processor,
    vue: processor
  }
}
`
fs.writeFileSync(filePath, content)

// Format files.
async function format() {
  const linter = new FlatESLint({ fix: true })
  const report = await linter.lintFiles([filePath])
  FlatESLint.outputFixes(report)
}

format()
