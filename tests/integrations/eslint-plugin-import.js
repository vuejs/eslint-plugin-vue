/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const cp = require('child_process')
const path = require('path')
const semver = require('semver')

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ESLINT = `.${path.sep}node_modules${path.sep}.bin${path.sep}eslint`

describe('Integration with eslint-plugin-import', () => {
  let originalCwd

  before(() => {
    originalCwd = process.cwd()
    process.chdir(path.join(__dirname, 'eslint-plugin-import'))
    cp.execSync('npm i', { stdio: 'inherit' })
  })
  after(() => {
    process.chdir(originalCwd)
  })

  // https://github.com/vuejs/eslint-plugin-vue/issues/21#issuecomment-308957697
  // eslint-plugin-vue had been breaking eslint-plugin-import if people use both at the same time.
  // This test is in order to prevent the regression.
  it('should lint without errors', () => {
    if (
      !semver.satisfies(
        process.version,
        require(path.join(
          __dirname,
          'eslint-plugin-import/node_modules/eslint/package.json'
        )).engines.node
      )
    ) {
      return
    }

    cp.execSync(`${ESLINT} a.vue`, { stdio: 'inherit' })
  })
})
