import type { Linter as ESLintLinter } from 'eslint'
import type { ScriptSetupVisitor } from 'eslint-plugin-vue/util-types/utils'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import tsParser from '@typescript-eslint/parser'
import vueEslintParser from 'vue-eslint-parser'
import { Linter } from '../../../../eslint-compat'
import { defineScriptSetupVisitor } from '../../../../../lib/utils/index'

export const FIXTURES_ROOT = path.resolve(
  __dirname,
  '../../../../fixtures/utils/ts-utils'
)

const TSCONFIG_PATH = path.resolve(FIXTURES_ROOT, './tsconfig.json')

export function verifyWithTsParser(
  code: string,
  visitor: ScriptSetupVisitor,
  tsTestFilePath?: string,
  tsFileCode = ''
): void {
  const linter = new Linter()
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
              return defineScriptSetupVisitor(context, visitor)
            }
          } as RuleModule
        }
      }
    },
    rules: {
      'test/test': 'error'
    }
  }
  if (tsTestFilePath) {
    fs.writeFileSync(tsTestFilePath, tsFileCode, 'utf8')
    tsParser.clearCaches()
  }
  assert.deepStrictEqual(
    linter.verify(code, config, path.join(FIXTURES_ROOT, './src/test.vue')),
    []
  )
  if (tsTestFilePath) {
    fs.writeFileSync(tsTestFilePath, '', 'utf8')
  }
}
