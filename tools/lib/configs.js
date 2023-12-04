/**
 * @author Michał Sajnóg <https://github.com/michalsnik>
 * See LICENSE file in root directory for full license.
 */

'use strict'

const fs = require('fs')
const path = require('path')
const ROOT = path.resolve(__dirname, '../../lib/configs')
const FLAT = path.resolve(ROOT, 'flat')

/**
 * @param {boolean} flat
 * @returns {string[]}
 */
function listConfigs(flat) {
  const configDir = flat ? FLAT : ROOT

  return fs
    .readdirSync(configDir)
    .filter((file) => path.extname(file) === '.js')
    .map((file) => {
      const prefix = flat ? 'flat/' : ''
      return prefix + path.basename(file, '.js')
    })
}

module.exports = {
  root: listConfigs(false),
  flat: listConfigs(true)
}
