/**
 * Test for getComponentPropsFromTypeDefineTypes
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
const SNAPSHOT_ROOT = path.resolve(FIXTURES_ROOT, './get-component-props')

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

describe('getComponentPropsFromTypeDefineTypes', () => {
  it.each([
    {
      name: 'inline-type',
      scriptCode: `defineProps<{foo:string,bar?:number}>()`
    },
    {
      name: 'intersection-type',
      scriptCode: `defineProps<{foo:string,bar?:number} & {baz?:string|number}>()`
    },
    {
      name: 'imported-type',
      tsFileCode: `export type Props = {foo:string,bar?:number}`,
      scriptCode: `import { Props } from './test'
      defineProps<Props>()`
    },
    {
      name: 'imported-any',
      tsFileCode: `export type Props = any`,
      scriptCode: `import { Props } from './test'
      defineProps<Props>()`
    },
    {
      name: 'imported-extends-required',
      tsFileCode: `
      interface Props {
        a?: number;
        b?: string;
      }
      export interface Props2 extends Required<Props> {
        c?: boolean;
      }`,
      scriptCode: `import { Props2 } from './test'
      defineProps<Props2>()`
    },
    {
      name: 'imported-complex-types',
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
      defineProps<Props>()`
    },
    {
      name: 'imported-intersection',
      tsFileCode: `
      export interface Props {
        a?: number;
        b?: string;
      }`,
      scriptCode: `import { Props } from './test'
defineProps<Props & {foo?:string}>()`
    },
    {
      name: 'imported-type-alias',
      tsFileCode: `
      export type A = string | number`,
      scriptCode: `import { A } from './test'
defineProps<{foo?:A}>()`
    },
    {
      name: 'inline-enum',
      scriptCode: `enum A {a = 'a', b = 'b'}
defineProps<{foo?:A}>()`
    },
    {
      name: 'inline-enum-mixed',
      scriptCode: `
const foo = 42
enum A {a = foo, b = 'b'}
defineProps<{foo?:A}>()`
    }
  ])(
    'should return expected props with $name',
    async ({ name, scriptCode, tsFileCode }) => {
      const code = `<script setup lang="ts"> ${scriptCode} </script>`
      const props = extractComponentProps(code, tsFileCode)

      await expect(JSON.stringify(props, null, 4)).toMatchFileSnapshot(
        path.join(SNAPSHOT_ROOT, `${name}.json`)
      )
    }
  )
})
