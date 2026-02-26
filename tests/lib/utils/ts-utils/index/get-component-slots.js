/**
 * Test for getComponentSlotsFromTypeDefineTypes
 */
'use strict'

const path = require('node:path')
const fs = require('node:fs')
const Linter = require('../../../../eslint-compat').Linter
const parser = require('vue-eslint-parser')
const tsParser = require('@typescript-eslint/parser')
const utils = require('../../../../../lib/utils/index')
const assert = require('node:assert')

const FIXTURES_ROOT = path.resolve(
  __dirname,
  '../../../../fixtures/utils/ts-utils'
)
const TSCONFIG_PATH = path.resolve(FIXTURES_ROOT, './tsconfig.json')
const SRC_TS_TEST_PATH = path.join(FIXTURES_ROOT, './src/test.ts')
const SNAPSHOT_ROOT = path.resolve(FIXTURES_ROOT, './get-component-slots')

function extractComponentSlots(code, tsFileCode) {
  const linter = new Linter()
  const result = []
  const config = {
    files: ['**/*.vue'],
    languageOptions: {
      parser,
      ecmaVersion: 2020,
      parserOptions: {
        parser: tsParser,
        project: [TSCONFIG_PATH],
        extraFileExtensions: ['.vue']
      }
    },
    plugins: {
      test: {
        rules: {
          test: {
            create(context) {
              return utils.defineScriptSetupVisitor(context, {
                onDefineSlotsEnter(_node, slots) {
                  result.push(
                    ...slots.map((prop) => ({
                      type: prop.type,
                      name: prop.slotName
                    }))
                  )
                }
              })
            }
          }
        }
      }
    },
    rules: {
      'test/test': 'error'
    }
  }
  fs.writeFileSync(SRC_TS_TEST_PATH, tsFileCode || '', 'utf8')
  // clean './src/test.ts' cache
  tsParser.clearCaches()
  assert.deepStrictEqual(
    linter.verify(code, config, path.join(FIXTURES_ROOT, './src/test.vue')),
    []
  )
  // reset
  fs.writeFileSync(SRC_TS_TEST_PATH, '', 'utf8')
  return result
}

describe('getComponentSlotsFromTypeDefineTypes', () => {
  it.each([
    {
      name: 'inline-type',
      scriptCode: `
        defineSlots<{
          default(props: { msg: string }): any
        }>()`
    },
    {
      name: 'inline-interface',
      scriptCode: `
        interface Slots {
          default(props: { msg: string }): any
        }
        defineSlots<Slots>()`
    },
    {
      name: 'inline-type-alias',
      scriptCode: `
        type Slots = {
          default(props: { msg: string }): any
        }
        defineSlots<Slots>()`
    }
  ])(
    'should return expected slots with $name',
    async ({ name, scriptCode, tsFileCode }) => {
      const code = `
      <script setup lang="ts">
      ${scriptCode}
      </script>
    `
      const slots = extractComponentSlots(code, tsFileCode)

      await expect(JSON.stringify(slots, null, 4)).toMatchFileSnapshot(
        path.join(SNAPSHOT_ROOT, `${name}.json`)
      )
    }
  )
})
