/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

/*
This script updates `lib/plugin.js` file from rule's meta data.
*/

const fs = require('fs')
const path = require('path')
const { FlatESLint } = require('eslint/use-at-your-own-risk')
const rules = require('./lib/rules')

// Update files.
const filePath = path.resolve(__dirname, '../lib/plugin.js')
const content = `/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
'use strict'

const plugin = {
  meta: require('./meta'),
  rules: {
    ${rules
      .map((rule) => `'${rule.name}': require('./rules/${rule.name}')`)
      .join(',\n')}
  },
  processors: {
    '.vue': require('./processor'),
    'vue': require('./processor')
  }
}

module.exports = plugin
`
fs.writeFileSync(filePath, content)

// Format files.
async function format() {
  const linter = new FlatESLint({ fix: true })
  const report = await linter.lintFiles([filePath])
  FlatESLint.outputFixes(report)
}

format()
