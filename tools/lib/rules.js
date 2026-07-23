/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */

'use strict'

const fs = require('node:fs')
const path = require('node:path')
const ROOT = path.resolve(__dirname, '../../lib/rules')

/**
 * @param {any} mod
 */
function interopDefault(mod) {
  return 'default' in mod ? mod.default : mod
}

module.exports = fs.readdirSync(ROOT).flatMap((file) => {
  const ext = path.extname(file)
  if (ext !== '.js' && ext !== '.ts') return []

  const name = path.basename(file, ext)

  const meta = { ...interopDefault(require(path.join(ROOT, file))).meta }
  if (meta.docs && !meta.docs.categories && meta.docs.category) {
    // for vue3 migration
    meta.docs = { ...meta.docs }
    meta.docs.categories = [meta.docs.category]
  }
  return [
    {
      ruleId: `vue/${name}`,
      name,
      ext,
      meta
    }
  ]
})
