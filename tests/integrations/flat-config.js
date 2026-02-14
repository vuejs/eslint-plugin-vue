'use strict'

const { strict: assert } = require('node:assert')
const { execSync } = require('node:child_process')
const path = require('node:path')
const semver = require('semver')

const TARGET_DIR = path.join(__dirname, 'flat-config')
const ESLINT = path.join(TARGET_DIR, 'node_modules', '.bin', 'eslint')

let eslintNodeVersion = ''

describe('Integration with flat config', () => {
  beforeAll(() => {
    execSync('npm i -f', { cwd: TARGET_DIR, stdio: 'inherit' })
    eslintNodeVersion = require(
      path.join(TARGET_DIR, 'node_modules/eslint/package.json')
    ).engines.node
  })

  it.skipIf(!semver.satisfies(process.version, eslintNodeVersion))(
    'should lint without errors',
    () => {
      const result = JSON.parse(
        execSync(`${ESLINT} a.vue --format=json`, {
          cwd: TARGET_DIR,
          encoding: 'utf8'
        })
      )
      assert.strictEqual(result.length, 1)
      assert.deepStrictEqual(result[0].messages, [])
    }
  )
})
