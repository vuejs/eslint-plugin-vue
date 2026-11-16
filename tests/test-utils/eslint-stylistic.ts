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
export const isESLintStylisticInstalled = existsSync(eslintStylisticPackagePath)
export const eslintStylisticVersion = isESLintStylisticInstalled
  ? (JSON.parse(readFileSync(eslintStylisticPackagePath, 'utf8'))
      .version as string)
  : undefined
