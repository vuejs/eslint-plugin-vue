'use strict'

const { strict: assert } = require('node:assert')
const cp = require('node:child_process')
const path = require('node:path')
const semver = require('semver')

const TARGET_DIR = path.join(__dirname, 'flat-config')
const ESLINT = `.${path.sep}node_modules${path.sep}.bin${path.sep}eslint`

describe('Integration with flat config', () => {
  beforeAll(() => {
    cp.execSync('npm i -f', { cwd: TARGET_DIR, stdio: 'inherit' })
  })

  it('should lint without errors', () => {
    if (
      !semver.satisfies(
        process.version,
        require(
          path.join(__dirname, 'flat-config/node_modules/eslint/package.json')
        ).engines.node
      )
    ) {
      return
    }

    const result = JSON.parse(
      cp.execSync(`${ESLINT} a.vue --format=json`, {
        cwd: TARGET_DIR,
        encoding: 'utf8'
      })
    )
    assert.strictEqual(result.length, 1)
    assert.deepStrictEqual(result[0].messages, [])
  })
})
