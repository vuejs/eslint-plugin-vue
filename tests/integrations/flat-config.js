'use strict'

const { strict: assert } = require('assert')
const cp = require('child_process')
const path = require('path')
const semver = require('semver')

const ESLINT = `.${path.sep}node_modules${path.sep}.bin${path.sep}eslint`

describe('Integration with flat config', () => {
  let originalCwd

  before(() => {
    originalCwd = process.cwd()
    process.chdir(path.join(__dirname, 'flat-config'))
    cp.execSync('npm i -f', { stdio: 'inherit' })
  })
  after(() => {
    process.chdir(originalCwd)
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
        encoding: 'utf8'
      })
    )
    assert.strictEqual(result.length, 1)
    assert.deepStrictEqual(result[0].messages, [])
  })
})
