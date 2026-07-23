/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

/*
This script updates `lib/plugin.js` file from rule's meta data.
*/

import fs from 'node:fs'
import path from 'node:path'
import * as ESLintModule from 'eslint'
import rules from './lib/rules.js'
import { camelCase } from '../lib/utils/casing.ts'
const __dirname = import.meta.dirname

const { ESLint } = ESLintModule

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
    (rule) =>
      `import ${camelCase(rule.name)} from './rules/${rule.name}${rule.ext}'`
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
  const linter = new ESLint({ fix: true })
  const report = await linter.lintFiles([filePath])
  await ESLint.outputFixes(report)
}

await format()
