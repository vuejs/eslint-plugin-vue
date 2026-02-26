import type { Linter as ESLintLinter } from 'eslint'
import assert from 'node:assert'
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
const SNAPSHOT_ROOT = path.resolve(FIXTURES_ROOT, './get-component-slots')

function extractComponentSlots(code: string) {
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
                onDefineSlotsEnter(_node, slots) {
                  result.push(
                    ...slots.map((slot) => ({
                      type: slot.type,
                      name: slot.slotName
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
  assert.deepStrictEqual(
    linter.verify(code, config, path.join(FIXTURES_ROOT, './src/test.vue')),
    []
  )
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
    async ({ name, scriptCode }) => {
      const code = `
      <script setup lang="ts">
      ${scriptCode}
      </script>
    `
      const slots = extractComponentSlots(code)

      await expect(JSON.stringify(slots, null, 4)).toMatchFileSnapshot(
        path.join(SNAPSHOT_ROOT, `${name}.json`)
      )
    }
  )
})
