/**
 * @author Wayne Zhang
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/valid-component-name')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('valid-component-name', rule, {
  valid: [
    '<template><keep-alive></keep-alive></template>',
    '<template><button/></template>',
    {
      filename: 'test.vue',
      code: `
      <template>
        <foo-button/>
        <div-bar/>
      </template>
      `,
      options: [{ allow: ['/^foo-/', '/-bar$/'] }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <Button/>
        <foo-button/>
      </template>
      `,
      errors: [
        {
          messageId: 'invalidName',
          data: { name: 'Button' },
          line: 3
        },
        {
          messageId: 'invalidName',
          data: { name: 'foo-button' },
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <bar-button/>
        <foo/>
      </template>
      `,
      options: [{ allow: ['/^foo-/', 'bar'] }],
      errors: [
        {
          messageId: 'invalidName',
          data: { name: 'bar-button' },
          line: 3
        },
        {
          messageId: 'invalidName',
          data: { name: 'foo' },
          line: 4
        }
      ]
    }
  ]
})
