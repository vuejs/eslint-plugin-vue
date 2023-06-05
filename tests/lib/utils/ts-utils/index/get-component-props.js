/**
 * Test for getComponentPropsFromTypeDefineTypes
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
        onDefinePropsEnter(_node, props) {
          result.push(
            ...props.map((prop) => ({
              type: prop.type,
              name: prop.propName,
              required: prop.required ?? null,
              types: prop.types ?? null
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

describe('getComponentPropsFromTypeDefineTypes', () => {
  for (const { scriptCode, tsFileCode, props: expected } of [
    {
      scriptCode: `defineProps<{foo:string,bar?:number}>()`,
      props: [
        { type: 'type', name: 'foo', required: true, types: ['String'] },
        { type: 'type', name: 'bar', required: false, types: ['Number'] }
      ]
    },
    {
      scriptCode: `defineProps<{foo:string,bar?:number} & {baz?:string|number}>()`,
      props: [
        { type: 'type', name: 'foo', required: true, types: ['String'] },
        { type: 'type', name: 'bar', required: false, types: ['Number'] },
        {
          type: 'type',
          name: 'baz',
          required: false,
          types: ['String', 'Number']
        }
      ]
    },
    {
      tsFileCode: `export type Props = {foo:string,bar?:number}`,
      scriptCode: `import { Props } from './test'
      defineProps<Props>()`,
      props: [
        { type: 'infer-type', name: 'foo', required: true, types: ['String'] },
        { type: 'infer-type', name: 'bar', required: false, types: ['Number'] }
      ]
    },
    {
      tsFileCode: `export type Props = any`,
      scriptCode: `import { Props } from './test'
      defineProps<Props>()`,
      props: [{ type: 'unknown', name: null, required: null, types: null }]
    },
    {
      tsFileCode: `
      interface Props {
        a?: number;
        b?: string;
      }
      export interface Props2 extends Required<Props> {
        c?: boolean;
      }`,
      scriptCode: `import { Props2 } from './test'
      defineProps<Props2>()`,
      props: [
        { type: 'infer-type', name: 'c', required: false, types: ['Boolean'] },
        { type: 'infer-type', name: 'a', required: true, types: ['Number'] },
        { type: 'infer-type', name: 'b', required: true, types: ['String'] }
      ]
    },
    {
      tsFileCode: `
      export type Props = {
        a: string
        b?: number
        c?: boolean
        d?: boolean
        e?: number | string
        f?: () => number
        g?: { foo?: string }
        h?: string[]
        i?: readonly string[]
      }`,
      scriptCode: `import { Props } from './test'
      defineProps<Props>()`,
      props: [
        { type: 'infer-type', name: 'a', required: true, types: ['String'] },
        { type: 'infer-type', name: 'b', required: false, types: ['Number'] },
        { type: 'infer-type', name: 'c', required: false, types: ['Boolean'] },
        { type: 'infer-type', name: 'd', required: false, types: ['Boolean'] },
        {
          type: 'infer-type',
          name: 'e',
          required: false,
          types: ['String', 'Number']
        },
        { type: 'infer-type', name: 'f', required: false, types: ['Function'] },
        { type: 'infer-type', name: 'g', required: false, types: ['Object'] },
        { type: 'infer-type', name: 'h', required: false, types: ['Array'] },
        { type: 'infer-type', name: 'i', required: false, types: ['Array'] }
      ]
    },
    {
      tsFileCode: `
      export interface Props {
        a?: number;
        b?: string;
      }`,
      scriptCode: `import { Props } from './test'
defineProps<Props & {foo?:string}>()`,
      props: [
        { type: 'infer-type', name: 'a', required: false, types: ['Number'] },
        { type: 'infer-type', name: 'b', required: false, types: ['String'] },
        { type: 'type', name: 'foo', required: false, types: ['String'] }
      ]
    },
    {
      tsFileCode: `
      export type A = string | number`,
      scriptCode: `import { A } from './test'
defineProps<{foo?:A}>()`,
      props: [
        {
          type: 'type',
          name: 'foo',
          required: false,
          types: ['String', 'Number']
        }
      ]
    },
    {
      scriptCode: `enum A {a = 'a', b = 'b'}
defineProps<{foo?:A}>()`,
      props: [{ type: 'type', name: 'foo', required: false, types: ['String'] }]
    },
    {
      scriptCode: `
const foo = 42
enum A {a = foo, b = 'b'}
defineProps<{foo?:A}>()`,
      props: [
        {
          type: 'type',
          name: 'foo',
          required: false,
          types: ['Number', 'String']
        }
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
