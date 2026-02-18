import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const eslintStylisticPackagePath = path.join(
  __dirname,
  '../..',
  'node_modules',
  '@stylistic',
  'eslint-plugin',
  'package.json'
)
export const eslintStylisticVersion = existsSync(eslintStylisticPackagePath)
  ? JSON.parse(readFileSync(eslintStylisticPackagePath, 'utf8')).version
  : undefined
