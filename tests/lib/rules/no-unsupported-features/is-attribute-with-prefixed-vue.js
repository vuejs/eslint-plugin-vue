/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../../lib/rules/no-unsupported-features')
const utils = require('./utils')

const buildOptions = utils.optionsBuilder(
  'is-attribute-with-prefixed-vue',
  '^3.1.0'
)
const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2019
  }
})

tester.run('no-unsupported-features/is-attribute-with-prefixed-vue', rule, {
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
        ignores: ['is-attribute-with-prefixed-vue']
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
          line: 3
        }
      ]
    }
  ]
})
