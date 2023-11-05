/**
 * @author Michał Sajnóg <https://github.com/michalsnik>
 * See LICENSE file in root directory for full license.
 */

'use strict'

const fs = require('fs')
const path = require('path')
const ROOT = path.resolve(__dirname, '../../lib/configs')
const FLAT = path.resolve(ROOT, 'flat')

function listConfigs(configDir, flat) {
  return fs
    .readdirSync(configDir)
    .filter((file) => path.extname(file) === '.js')
    .map((file) => {
      const prefix = flat ? 'flat/' : ''
      return prefix + path.basename(file, '.js')
    })
}

module.exports = {
  root: listConfigs(ROOT, false),
  flat: listConfigs(FLAT, true)
}
