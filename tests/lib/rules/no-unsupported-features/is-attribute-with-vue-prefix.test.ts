/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import vueESLintParser from 'vue-eslint-parser'
import { RuleTester } from '../../../eslint-compat'
import rule from '../../../../lib/rules/no-unsupported-features'
import { optionsBuilder } from './utils.ts'

const buildOptions = optionsBuilder('is-attribute-with-vue-prefix', '^3.1.0')
const tester = new RuleTester({
  languageOptions: { parser: vueESLintParser, ecmaVersion: 2019 }
})

tester.run('no-unsupported-features/is-attribute-with-vue-prefix', rule, {
  valid: [
    {
      code: `
       <template>
         <div is="vue:foo" />
       </template>`,
      options: buildOptions()
    },
    {
      code: `
       <template>
         <div is="foo" />
       </template>`,
      options: buildOptions({ version: '^2.5.0' })
    },
    {
      code: `
       <template>
         <div is="vue:foo" />
       </template>`,
      options: buildOptions({
        version: '^2.5.0',
        ignores: ['is-attribute-with-vue-prefix']
      })
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <div is="vue:foo" />
      </template>`,
      options: buildOptions({ version: '^3.0.0' }),
      errors: [
        {
          message: '`is="vue:"` are not supported until Vue.js "3.1.0".',
          line: 3,
          column: 17,
          endLine: 3,
          endColumn: 26
        }
      ]
    }
  ]
})
