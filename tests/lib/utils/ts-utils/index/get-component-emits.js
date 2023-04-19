/**
 * Test for getComponentEmitsFromTypeDefineTypes
 */
'use strict'

const path = require('path')
const fs = require('fs')
const Linter = require('eslint').Linter
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

function extractComponentProps(code, tsFileCode) {
  const linter = new Linter()
  const config = {
    parser: 'vue-eslint-parser',
    parserOptions: {
      ecmaVersion: 2020,
      parser: tsParser,
      project: [TSCONFIG_PATH],
      extraFileExtensions: ['.vue']
    },
    rules: {
      test: 'error'
    }
  }
  linter.defineParser('vue-eslint-parser', parser)
  const result = []
  linter.defineRule('test', {
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
  })
  fs.writeFileSync(SRC_TS_TEST_PATH, tsFileCode || '', 'utf8')
  // clean './src/test.ts' cache
  tsParser.parseForESLint(tsFileCode || '', {
    ...config.parserOptions,
    filePath: SRC_TS_TEST_PATH
  })
  assert.deepStrictEqual(
    linter.verify(code, config, path.join(FIXTURES_ROOT, './src/test.vue')),
    []
  )
  // reset
  fs.writeFileSync(SRC_TS_TEST_PATH, '', 'utf8')
  return result
}

describe('getComponentEmitsFromTypeDefineTypes', () => {
  for (const { scriptCode, tsFileCode, props: expected } of [
    {
      scriptCode: `defineEmits<{(e:'foo'):void,(e:'bar'):void}>()`,
      props: [
        { type: 'type', name: 'foo' },
        { type: 'type', name: 'bar' }
      ]
    },
    {
      tsFileCode: `export type Emits = {(e:'foo'):void,(e:'bar'):void}`,
      scriptCode: `import { Emits } from './test'
      defineEmits<Emits>()`,
      props: [
        { type: 'infer-type', name: 'foo' },
        { type: 'infer-type', name: 'bar' }
      ]
    },
    {
      tsFileCode: `export type Emits = any`,
      scriptCode: `import { Emits } from './test'
      defineEmits<Emits>()`,
      props: [{ type: 'unknown', name: null }]
    },
    {
      tsFileCode: `export type Emits = {(e:'foo' | 'bar'): void, (e:'baz',payload:number): void}`,
      scriptCode: `import { Emits } from './test'
      defineEmits<Emits>()`,
      props: [
        { type: 'infer-type', name: 'foo' },
        { type: 'infer-type', name: 'bar' },
        { type: 'infer-type', name: 'baz' }
      ]
    },
    {
      tsFileCode: `export type Emits = { a: [], b: [number], c: [string]}`,
      scriptCode: `import { Emits } from './test'
      defineEmits<Emits>()`,
      props: [
        { type: 'infer-type', name: 'a' },
        { type: 'infer-type', name: 'b' },
        { type: 'infer-type', name: 'c' }
      ]
    }
  ]) {
    const code = `<script setup lang="ts"> ${scriptCode} </script>`
    it(`should return expected props with :${code}`, () => {
      const props = extractComponentProps(code, tsFileCode)

      assert.deepStrictEqual(
        props,
        expected,
        `\n${JSON.stringify(props)}\n === \n${JSON.stringify(expected)}`
      )
    })
  }
})
