/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const fs = require('fs')
const path = require('path')
const eslint = require('eslint')
const ruleNames = new Set(new eslint.Linter().getRules().keys())

const TYPINGS_ESLINT_RULES_ROOT = path.resolve(
  __dirname,
  '../typings/eslint/lib/rules'
)

mkdirIfNotExists(TYPINGS_ESLINT_RULES_ROOT)

for (const ruleName of ruleNames) {
  const filePath = path.join(TYPINGS_ESLINT_RULES_ROOT, `${ruleName}.d.ts`)
  fs.writeFileSync(
    filePath,
    `import { Rule } from '../../index'
declare const rule: Rule.RuleModule
export = rule
`
  )
}

fs.readdirSync(TYPINGS_ESLINT_RULES_ROOT)
  .filter((file) => file.endsWith('.d.ts'))
  .filter((file) => !ruleNames.has(file.slice(0, -5)))
  .map((file) => path.join(TYPINGS_ESLINT_RULES_ROOT, file))
  .forEach((filePath) => fs.unlinkSync(filePath))

function exists(file) {
  try {
    fs.statSync(file)
    return true
  } catch (err) {
    if (err.code === 'ENOENT') return false
  }
}

function mkdirIfNotExists(dir) {
  if (exists(dir)) {
    return
  }
  const p = path.dirname(dir)
  mkdirIfNotExists(p)
  fs.mkdirSync(dir)
}
