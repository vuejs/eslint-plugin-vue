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
const { FlatESLint } = require('eslint/use-at-your-own-risk')
const rules = require('./lib/rules')
const configs = require('./lib/configs')

// Update files.
const filePath = path.resolve(__dirname, '../lib/index.js')
const content = `/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
'use strict'

const mod = {
  meta: require('./meta'),
  rules: {
    ${rules
      .map((rule) => `'${rule.name}': require('./rules/${rule.name}')`)
      .join(',\n')}
  },
  configs: {
    ${configs
      .map((config) => `'${config}': require('./configs/${config}')`)
      .join(',\n')}
  },
  processors: {
    '.vue': require('./processor')
  },
  environments: {
    // TODO Remove in the next major version
    /** @deprecated */
    'setup-compiler-macros': {
      globals: {
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly'
      }
    }
  }
}

const baseConfig = {plugins: {vue: mod}}

Object.assign(mod.configs, {
  'flat/base': Object.assign(baseConfig, require('./configs/flat/base.js')),

  'flat/vue2-essential': Object.assign(baseConfig, require('./configs/flat/vue2-essential.js')),
  'flat/vue2-recommended': Object.assign(baseConfig, require('./configs/flat/vue2-recommended.js')),
  'flat/vue2-strongly-recommended': Object.assign(baseConfig, require('./configs/flat/vue2-strongly-recommended.js')),

  // in flat configs, non-prefixed config is for Vue 3 (unlike eslintrc configs)
  'flat/essential': Object.assign(baseConfig, require('./configs/flat/vue3-essential.js')),
  'flat/recommended': Object.assign(baseConfig, require('./configs/flat/vue3-recommended.js')),
  'flat/strongly-recommended': Object.assign(baseConfig, require('./configs/flat/vue3-strongly-recommended.js')),
})

module.exports = mod
`
fs.writeFileSync(filePath, content)

// Format files.
async function format() {
  const linter = new FlatESLint({ fix: true })
  const report = await linter.lintFiles([filePath])
  FlatESLint.outputFixes(report)
}

format()
