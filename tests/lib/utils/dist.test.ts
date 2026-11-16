/**
 * Custom rules use the internal utils from the built package.
 * https://github.com/vuejs/eslint-plugin-vue/issues/3005
 */
import { strict as assert } from 'node:assert'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const UTILS_PATH = path.resolve(__dirname, '../../../dist/utils/index.js')

describe('dist/utils/index.js', () => {
  it('should be usable with require() without `.default`', () => {
    const utils = createRequire(import.meta.url)(UTILS_PATH)

    assert.strictEqual(typeof utils.defineTemplateBodyVisitor, 'function')
    assert.strictEqual(utils.default, utils)
  })

  it('should be usable as the default export of an ES module import', () => {
    const output = execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '--eval',
        `import utils from ${JSON.stringify(pathToFileURL(UTILS_PATH).href)}
        console.log(typeof utils.defineTemplateBodyVisitor, typeof utils.default.defineTemplateBodyVisitor)`
      ],
      { encoding: 'utf8' }
    )

    assert.strictEqual(output.trim(), 'function function')
  })
})
