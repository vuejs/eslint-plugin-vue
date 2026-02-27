/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../../eslint-compat.ts'
import rule from '../../../../lib/rules/no-unsupported-features'
import { optionsBuilder } from './utils.ts'
import vueEslintParser from 'vue-eslint-parser'

const buildOptions = optionsBuilder('dynamic-directive-arguments', '^2.5.0')
const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2019 }
})

tester.run('no-unsupported-features/dynamic-directive-arguments', rule, {
  valid: [
    {
      code: `
      <template>
        <a :[href]="'/xxx'" />
      </template>`,
      options: buildOptions({ version: '^2.6.0' })
    },
    {
      code: `
      <template>
        <a @[click]="onClick" />
      </template>`,
      options: buildOptions({ version: '^2.6.0' })
    },
    {
      code: `
      <template>
        <a :href="'/xxx'" />
      </template>`,
      options: buildOptions()
    },
    {
      code: `
      <template>
        <a @click="onClick" />
      </template>`,
      options: buildOptions()
    },
    {
      code: `
      <template>
        <a :[href]="'/xxx'" />
      </template>`,
      options: buildOptions({ version: '^3.0.0' })
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <a :[href]="'/xxx'" />
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message: 'Dynamic arguments are not supported until Vue.js "2.6.0".',
          line: 3
        }
      ]
    },
    {
      code: `
      <template>
        <a @[click]="onClick" />
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message: 'Dynamic arguments are not supported until Vue.js "2.6.0".',
          line: 3
        }
      ]
    }
  ]
})
