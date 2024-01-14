/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../../eslint-compat').RuleTester
const rule = require('../../../../lib/rules/no-unsupported-features')
const utils = require('./utils')

const buildOptions = utils.optionsBuilder('v-model-argument', '^2.6.0')
const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2019 }
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
