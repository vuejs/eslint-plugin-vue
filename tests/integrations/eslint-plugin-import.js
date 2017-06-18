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

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe('Integration with eslint-plugin-import', () => {
  let originalCwd

  before(() => {
    originalCwd = process.cwd()
    process.chdir(path.join(__dirname, 'eslint-plugin-import'))
    cp.execSync('npm i', { stdio: 'inherit', env: { npm_config_package_lock: 'false' }})
  })
  after(() => {
    process.chdir(originalCwd)
  })

  it('should lint without errors', () => {
    cp.execSync(`.${path.sep}node_modules${path.sep}.bin${path.sep}eslint a.vue`, { stdio: 'inherit' })
  })
})
