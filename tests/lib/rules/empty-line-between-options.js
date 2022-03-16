/**
 * @author Barthy Bonhomme <post@barthy.koeln> (https://github.com/barthy-koeln)
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/empty-line-between-options')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('empty-line-between-options', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>

      </template>

      <script>
      export default {
        name: 'AComponentOfSorts',

        /**
         * @return {Object}
         */
        data(){
          return {}
        },

        /* red */ i18n: {},

        config: {} /* green */,

        /* who */ /* writes */
        /* comments like this */
        computed: {}
      }
      </script>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>

      </template>

      <script>
      export default {
        name: 'AComponentOfSorts',
        /**
         * @return {Object}
         */
        data(){
          return {}
        },
        /* red */ i18n: {},
        config: {} /* green */,
        /* who */ /* writes */
        /* comments like this */
        computed: {}
      }
      </script>
      `,
      output: `
      <template>

      </template>

      <script>
      export default {
        name: 'AComponentOfSorts',

        /**
         * @return {Object}
         */
        data(){
          return {}
        },

        /* red */ i18n: {},

        config: {} /* green */,

        /* who */ /* writes */
        /* comments like this */
        computed: {}
      }
      </script>
      `,
      errors: [
        {
          message: rule.meta.messages.always,
          line: 12,
          column: 9
        },
        {
          message: rule.meta.messages.always,
          line: 15,
          column: 19
        },
        {
          message: rule.meta.messages.always,
          line: 16,
          column: 9
        },
        {
          message: rule.meta.messages.always,
          line: 19,
          column: 9
        }
      ]
    },
    {
      filename: 'test-never.vue',
      code: `
      <template></template>

      <script>
      export default {
        name: 'AComponentOfSorts',
        
        /**
         * @return {Object}
         */
        data(){
          return {}
        },
        
        /* red */ i18n: {},
        
        config: {} /* green */,
        
        /* who */ /* writes */
        /* comments like this */
        computed: {}
      }
      </script>
      `,
      output: `
      <template></template>

      <script>
      export default {
        name: 'AComponentOfSorts',
        /**
         * @return {Object}
         */
        data(){
          return {}
        },
        /* red */ i18n: {},
        config: {} /* green */,
        /* who */ /* writes */
        /* comments like this */
        computed: {}
      }
      </script>
      `,
      errors: [
        {
          message: rule.meta.messages.never,
          line: 11,
          column: 9
        },
        {
          message: rule.meta.messages.never,
          line: 15,
          column: 19
        },
        {
          message: rule.meta.messages.never,
          line: 17,
          column: 9
        },
        {
          message: rule.meta.messages.never,
          line: 21,
          column: 9
        }
      ],
      options: ['never']
    }
  ]
})
