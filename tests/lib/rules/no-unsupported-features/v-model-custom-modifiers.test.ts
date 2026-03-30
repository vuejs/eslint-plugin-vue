/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import vueESLintParser from 'vue-eslint-parser'
import { RuleTester } from '../../../eslint-compat'
import rule from '../../../../lib/rules/no-unsupported-features'
import { optionsBuilder } from './utils.ts'

const buildOptions = optionsBuilder('v-model-custom-modifiers', '^2.6.0')
const tester = new RuleTester({
  languageOptions: { parser: vueESLintParser, ecmaVersion: 2019 }
})

tester.run('no-unsupported-features/v-model-custom-modifiers', rule, {
  valid: [
    {
      code: `
      <template>
        <MyInput v-model:foo.bar="foo" />
      </template>`,
      options: buildOptions({ version: '^3.0.0' })
    },
    {
      code: `
      <template>
        <MyInput v-model.foo="foo" />
      </template>`,
      options: buildOptions({ version: '^3.0.0' })
    },
    {
      code: `
      <template>
        <MyInput v-model.trim="foo" />
      </template>`,
      options: buildOptions()
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <MyInput v-model:foo.bar="foo" />
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message:
            'Custom modifiers on `v-model` are not supported until Vue.js "3.0.0".',
          line: 3,
          column: 30,
          endLine: 3,
          endColumn: 33
        }
      ]
    },
    {
      code: `
      <template>
        <MyInput v-model.foo="foo" />
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message:
            'Custom modifiers on `v-model` are not supported until Vue.js "3.0.0".',
          line: 3,
          column: 26,
          endLine: 3,
          endColumn: 29
        }
      ]
    }
  ]
})
