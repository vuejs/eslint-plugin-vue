/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../../eslint-compat.ts'
import rule from '../../../../lib/rules/no-unsupported-features'
import { optionsBuilder } from './utils.ts'
import vueEslintParser from 'vue-eslint-parser'

const buildOptions = optionsBuilder('v-model-argument', '^2.6.0')
const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2019 }
})

tester.run('no-unsupported-features/v-model-argument', rule, {
  valid: [
    {
      code: `
      <template>
        <MyInput v-model:foo="foo" />
      </template>`,
      options: buildOptions({ version: '^3.0.0' })
    },
    {
      code: `
      <template>
        <MyInput v-model="foo" />
      </template>`,
      options: buildOptions()
    },
    {
      code: `
      <template>
        <MyInput v-bind:foo.sync="foo" />
      </template>`,
      options: buildOptions()
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <MyInput v-model:foo="foo" />
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message:
            'Argument on `v-model` is not supported until Vue.js "3.0.0".',
          line: 3
        }
      ]
    }
  ]
})
