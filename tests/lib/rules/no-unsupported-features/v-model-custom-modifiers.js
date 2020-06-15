/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../../lib/rules/no-unsupported-features')
const utils = require('./utils')

const buildOptions = utils.optionsBuilder('v-model-custom-modifiers', '^2.6.0')
const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2019
  }
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
          line: 3
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
          line: 3
        }
      ]
    }
  ]
})
