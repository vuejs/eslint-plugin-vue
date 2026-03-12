/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import semver from 'semver'

const PLUGIN_DIR = path.join(__dirname, 'eslint-plugin-import')
const ESLINT = path.join(PLUGIN_DIR, 'node_modules', '.bin', 'eslint')

let eslintNodeVersion = ''

describe('Integration with eslint-plugin-import', () => {
  beforeAll(() => {
    execSync('npm i', { cwd: PLUGIN_DIR, stdio: 'inherit' })
    const eslintPackagePath = path.join(
      PLUGIN_DIR,
      'node_modules/eslint/package.json'
    )
    eslintNodeVersion = JSON.parse(readFileSync(eslintPackagePath, 'utf8'))
      .engines.node
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
