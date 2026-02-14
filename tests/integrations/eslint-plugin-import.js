/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const { execSync } = require('node:child_process')
const path = require('node:path')
const semver = require('semver')

const PLUGIN_DIR = path.join(__dirname, 'eslint-plugin-import')
const ESLINT = path.join(PLUGIN_DIR, 'node_modules', '.bin', 'eslint')

let eslintNodeVersion = ''

describe('Integration with eslint-plugin-import', () => {
  beforeAll(() => {
    execSync('npm i', { cwd: PLUGIN_DIR, stdio: 'inherit' })
    eslintNodeVersion = require(
      path.join(PLUGIN_DIR, 'node_modules/eslint/package.json')
    ).engines.node
  })

  // https://github.com/vuejs/eslint-plugin-vue/issues/21#issuecomment-308957697
  // eslint-plugin-vue had been breaking eslint-plugin-import if people use both at the same time.
  // This test is in order to prevent the regression.
  it.skipIf(!semver.satisfies(process.version, eslintNodeVersion))(
    'should lint without errors',
    () => {
      execSync(`${ESLINT} --config eslint.config.mjs a.vue`, {
        cwd: PLUGIN_DIR,
        stdio: 'inherit'
      })
    }
  )
})
