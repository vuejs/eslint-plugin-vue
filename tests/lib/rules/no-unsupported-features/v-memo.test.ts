/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

import { RuleTester } from '../../../eslint-compat'
import rule from '../../../../lib/rules/no-unsupported-features'
import { optionsBuilder } from './utils.ts'

const buildOptions = optionsBuilder('v-memo', '^3.1.0')
const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2019 }
})

tester.run('no-unsupported-features/v-memo', rule, {
  valid: [
    {
      code: `
      <template>
        <div v-memo="foo" />
      </template>`,
      options: buildOptions({ version: '^3.2.0' })
    },
    {
      code: `
      <template>
        <div :memo="foo" />
      </template>`,
      options: buildOptions()
    },
    {
      code: `
      <template>
        <div v-memo="foo" />
      </template>`,
      options: buildOptions({ version: '^2.5.0', ignores: ['v-memo'] })
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <div v-memo="foo" />
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message: '`v-memo` are not supported until Vue.js "3.2.0".',
          line: 3
        }
      ]
    }
  ]
})
