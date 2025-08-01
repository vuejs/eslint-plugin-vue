const { existsSync, readFileSync } = require('node:fs')
const path = require('node:path')

const eslintStylisticPackagePath = path.join(
  __dirname,
  '../..',
  'node_modules',
  '@stylistic',
  'eslint-plugin',
  'package.json'
)
const eslintStylisticVersion = existsSync(eslintStylisticPackagePath)
  ? JSON.parse(readFileSync(eslintStylisticPackagePath, 'utf8')).version
  : undefined

module.exports = { eslintStylisticVersion }
