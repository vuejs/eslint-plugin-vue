/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

/*
This script updates `lib/index.js` file from rule's meta data.
*/

const fs = require('fs')
const path = require('path')
const eslint = require('eslint')
const rules = require('./lib/rules')
const configs = require('./lib/configs')

// Update files.
const filePath = path.resolve(__dirname, '../lib/index.js')
const content = `/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update it's content execute "npm run update"
 */
'use strict'

module.exports = {
  rules: {
    ${rules.map(rule => `'${rule.name}': require('./rules/${rule.name}')`).join(',\n')}
  },
  configs: {
    ${configs.map(config => `'${config}': require('./configs/${config}')`).join(',\n')}
  },
  processors: {
    '.vue': require('./processor')
  }
}
`
fs.writeFileSync(filePath, content)

// Format files.
const linter = new eslint.CLIEngine({ fix: true })
const report = linter.executeOnFiles([filePath])
eslint.CLIEngine.outputFixes(report)
