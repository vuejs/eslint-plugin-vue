import fs from 'node:fs/promises'
import { pluginsToRulesDTS } from 'eslint-typegen/core'
import plugin from '../lib/index.ts'

const dts = await pluginsToRulesDTS(
  {
    vue: plugin
  },
  {
    includeAugmentation: false
  }
)

await fs.writeFile('lib/eslint-typegen.d.ts', dts)
