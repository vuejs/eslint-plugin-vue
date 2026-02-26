import type { Linter as ESLintLinter } from 'eslint'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import tsParser from '@typescript-eslint/parser'
import vueEslintParser from 'vue-eslint-parser'
import { Linter } from '../../../../eslint-compat'
import { defineScriptSetupVisitor } from '../../../../../lib/utils/index'

const FIXTURES_ROOT = path.resolve(
  __dirname,
  '../../../../fixtures/utils/ts-utils'
)
const TSCONFIG_PATH = path.resolve(FIXTURES_ROOT, './tsconfig.json')
const SRC_TS_TEST_PATH = path.join(FIXTURES_ROOT, './src/test.ts')
const SNAPSHOT_ROOT = path.resolve(FIXTURES_ROOT, './get-component-props')

function extractComponentProps(code: string, tsFileCode = '') {
  const linter = new Linter()
  const result: {
    type: string
    name: string | null
    required: boolean | null
    types: string[] | null
  }[] = []
  const config: ESLintLinter.Config = {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueEslintParser,
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
              return defineScriptSetupVisitor(context, {
                onDefinePropsEnter(_node, props) {
                  result.push(
                    ...props.map((prop) => ({
                      type: prop.type,
                      name: prop.propName,
                      required: 'required' in prop ? prop.required : null,
                      types: 'types' in prop ? prop.types : null
                    }))
                  )
                }
              })
            }
          } as RuleModule
        }
      }
    },
    rules: {
      'test/test': 'error'
    }
  }
  fs.writeFileSync(SRC_TS_TEST_PATH, tsFileCode, 'utf8')
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

describe.sequential('getComponentPropsFromTypeDefineTypes', () => {
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
