import { existsSync } from 'node:fs'
import path from 'node:path'

export const isESLintStylisticInstalled = existsSync(
  path.join(
    __dirname,
    '../..',
    'node_modules',
    '@stylistic',
    'eslint-plugin',
    'package.json'
  )
)
