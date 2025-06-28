import fs from 'node:fs/promises'
import { pluginsToRulesDTS } from 'eslint-typegen/core'
import plugin from '../lib/index.js'

const dts = await pluginsToRulesDTS({
  vue: plugin
})

await fs.writeFile('lib/eslint-typegen.d.ts', dts)
