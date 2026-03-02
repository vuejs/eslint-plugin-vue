import { strict as assert } from 'node:assert'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import semver from 'semver'

const TARGET_DIR = path.join(__dirname, 'flat-config')
const ESLINT = path.join(TARGET_DIR, 'node_modules', '.bin', 'eslint')

let eslintNodeVersion = ''

describe('Integration with flat config', () => {
  beforeAll(() => {
    execSync('npm i -f', { cwd: TARGET_DIR, stdio: 'inherit' })
    const eslintPackagePath = path.join(
      TARGET_DIR,
      'node_modules/eslint/package.json'
    )
    eslintNodeVersion = JSON.parse(readFileSync(eslintPackagePath, 'utf8'))
      .engines.node
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
