import { describe, it } from "vitest";
/**
 * Test for getComponentSlotsFromTypeDefineTypes
 */
'use strict'

const path = require('path')
const fs = require('fs')
const Linter = require('../../../../eslint-compat').Linter
const parser = require('vue-eslint-parser')
const tsParser = require('@typescript-eslint/parser')
const utils = require('../../../../../lib/utils/index')
const assert = require('assert')

const FIXTURES_ROOT = path.resolve(
  __dirname,
  '../../../../fixtures/utils/ts-utils'
)
const TSCONFIG_PATH = path.resolve(FIXTURES_ROOT, './tsconfig.json')
const SRC_TS_TEST_PATH = path.join(FIXTURES_ROOT, './src/test.ts')

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
  for (const { scriptCode, tsFileCode, slots: expected } of [
    {
      scriptCode: `
        defineSlots<{
          default(props: { msg: string }): any
        }>()
      `,
      slots: [{ type: 'type', name: 'default' }]
    },
    {
      scriptCode: `
        interface Slots {
          default(props: { msg: string }): any
        }
        defineSlots<Slots>()
      `,
      slots: [{ type: 'type', name: 'default' }]
    },
    {
      scriptCode: `
        type Slots = {
          default(props: { msg: string }): any
        }
        defineSlots<Slots>()
      `,
      slots: [{ type: 'type', name: 'default' }]
    }
  ]) {
    const code = `
      <script setup lang="ts">
      ${scriptCode}
      </script>
    `
    it(`should return expected slots with :${code}`, () => {
      const slots = extractComponentSlots(code, tsFileCode)

      assert.deepStrictEqual(
        slots,
        expected,
        `\n${JSON.stringify(slots)}\n === \n${JSON.stringify(expected)}`
      )
    })
  }
})
