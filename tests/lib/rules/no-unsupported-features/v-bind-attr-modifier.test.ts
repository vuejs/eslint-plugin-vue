/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import vueESLintParser from 'vue-eslint-parser'
import { RuleTester } from '../../../eslint-compat'
import rule from '../../../../lib/rules/no-unsupported-features'
import { optionsBuilder } from './utils.ts'

const buildOptions = optionsBuilder('v-bind-attr-modifier', '^3.1.0')
const tester = new RuleTester({
  languageOptions: { parser: vueESLintParser, ecmaVersion: 2019 }
})

tester.run('no-unsupported-features/v-bind-attr-modifier', rule, {
  valid: [
    {
      code: `
      <template>
        <div :foo.attr="foo" />
      </template>`,
      options: buildOptions({ version: '^3.2.0' })
    },
    {
      code: `
      <template>
        <div v-bind:attr="foo" />
      </template>`,
      options: buildOptions()
    },
    {
      code: `
      <template>
        <div :foo.attr="foo" />
      </template>`,
      options: buildOptions({
        version: '^2.5.0',
        ignores: ['v-bind-attr-modifier']
      })
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <div :foo.attr="foo" />
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message:
            '`.attr` modifiers on `v-bind` are not supported until Vue.js "3.2.0".',
          line: 3,
          column: 19,
          endLine: 3,
          endColumn: 23
        }
      ]
    }
  ]
})
