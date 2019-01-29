/**
 * @author Michał Sajnóg
 * @copyright 2018 Michał Sajnóg. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

/*
 * This script updates `lib/configs/prettier.js`,
 * and disables all layout rules
 */

const fs = require('fs')
const path = require('path')
const rules = require('./lib/rules')

const rulesToDisable = rules.filter(({ meta }) => meta.type === 'layout')

function formatRules (rules) {
  const obj = rules.reduce((setting, rule) => {
    setting[rule.ruleId] = 'off'
    return setting
  }, {})
  return JSON.stringify(obj, null, 2)
}

function generateConfig (rules) {
  return `/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update it's content execute "npm run update"
 */
module.exports = {
  rules: ${formatRules(rules)}
}
`
}

// Update files.
const filePath = path.resolve(__dirname, '../lib/configs/no-layout-rules.js')
const content = generateConfig(rulesToDisable)
fs.writeFileSync(filePath, content)
