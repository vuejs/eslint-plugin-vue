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
const SNAPSHOT_ROOT = path.resolve(FIXTURES_ROOT, './get-component-emits')

function extractComponentEmits(code: string, tsFileCode = '') {
  const linter = new Linter()
  const result: { type: string; name: string | null }[] = []
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
      const emits = extractComponentEmits(code, tsFileCode)

      await expect(JSON.stringify(emits, null, 4)).toMatchFileSnapshot(
        path.join(SNAPSHOT_ROOT, `${name}.json`)
      )
    }
  )
})
