import fs from 'node:fs/promises'
import type { ESLint } from 'eslint'
import { pluginsToRulesDTS } from 'eslint-typegen/core'
import plugin from '../lib/plugin.ts'

const dts = await pluginsToRulesDTS(
  {
    vue: plugin as ESLint.Plugin
  },
  {
    includeAugmentation: false
  }
)

await fs.writeFile('lib/eslint-typegen.d.ts', dts)
