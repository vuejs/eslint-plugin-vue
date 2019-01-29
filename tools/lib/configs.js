/**
 * @author Michał Sajnóg <https://github.com/michalsnik>
 * See LICENSE file in root directory for full license.
 */

'use strict'

const fs = require('fs')
const path = require('path')
const ROOT = path.resolve(__dirname, '../../lib/configs')

module.exports =
  fs.readdirSync(ROOT)
    .filter(file => path.extname(file) === '.js')
    .map(file => path.basename(file, '.js'))
