/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */

'use strict'

const fs = require('fs')
const path = require('path')
const ROOT = path.resolve(__dirname, '../../lib/rules')

module.exports =
  fs.readdirSync(ROOT)
    .filter(file => path.extname(file) === '.js')
    .map(file => path.basename(file, '.js'))
    .map(name => ({
      ruleId: `vue/${name}`,
      name,
      meta: require(path.join(ROOT, name)).meta
    }))
