/**
 * @fileoverview Restrict or warn use of v-html to prevent XSS attack
 * @author Nathan Zeplowitz
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-v-html')

const ruleTester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

ruleTester.run('no-v-html', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="foo" v-bind="bar"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-html="htmlKnownToBeSafe"></div></template>',
      options: [{ ignorePattern: '^html' }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-html="foo"></div></template>',
      errors: [
        {
          message: "'v-html' directive can lead to XSS attack.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><ul v-html:aaa="userHTML"></ul></template>',
      errors: [
        {
          message: "'v-html' directive can lead to XSS attack.",
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><section v-html/></template>',
      errors: [
        {
          message: "'v-html' directive can lead to XSS attack.",
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-html="unsafeString"></div></template>',
      options: [{ ignorePattern: '^html' }],
      errors: [
        {
          message: "'v-html' directive can lead to XSS attack.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 37
        }
      ]
    }
  ]
})
