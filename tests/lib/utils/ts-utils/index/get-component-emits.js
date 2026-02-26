/**
 * Test for getComponentEmitsFromTypeDefineTypes
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
const SNAPSHOT_ROOT = path.resolve(FIXTURES_ROOT, './get-component-emits')

function extractComponentProps(code, tsFileCode) {
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
                onDefineEmitsEnter(_node, emits) {
                  result.push(
                    ...emits.map((emit) => ({
                      type: emit.type,
                      name: emit.emitName
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

describe('getComponentEmitsFromTypeDefineTypes', () => {
  it.each([
    {
      name: 'inline-call-signatures',
      scriptCode: `defineEmits<{(e:'foo'):void,(e:'bar'):void}>()`
    },
    {
      name: 'imported-call-signatures',
      tsFileCode: `export type Emits = {(e:'foo'):void,(e:'bar'):void}`,
      scriptCode: `import { Emits } from './test'
      defineEmits<Emits>()`
    },
    {
      name: 'imported-any',
      tsFileCode: `export type Emits = any`,
      scriptCode: `import { Emits } from './test'
      defineEmits<Emits>()`
    },
    {
      name: 'imported-union-call-signatures',
      tsFileCode: `export type Emits = {(e:'foo' | 'bar'): void, (e:'baz',payload:number): void}`,
      scriptCode: `import { Emits } from './test'
      defineEmits<Emits>()`
    },
    {
      name: 'imported-record-style',
      tsFileCode: `export type Emits = { a: [], b: [number], c: [string]}`,
      scriptCode: `import { Emits } from './test'
      defineEmits<Emits>()`
    }
  ])(
    'should return expected emits with $name',
    async ({ name, scriptCode, tsFileCode }) => {
      const code = `<script setup lang="ts"> ${scriptCode} </script>`
      const props = extractComponentProps(code, tsFileCode)

      await expect(JSON.stringify(props, null, 4)).toMatchFileSnapshot(
        path.join(SNAPSHOT_ROOT, `${name}.json`)
      )
    }
  )
})
