/**
 * @fileoverview detect if there is a potential typo in your component property
 * @author IWANABETHATGUY
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-potential-property-typo')

const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2017, sourceType: 'module' }
})
tester.run('no-potential-property-typo', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      export default {
        dat: {},
        method: {}
      }
      `
    }
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
      export default {
        dat: {},
        method: {}
      }
      `,
      options: [{ custom: ['data', 'methods'] }],
      errors: [
        `'dat' may be a typo, which is similar to vue component option 'data'.`,
        `'method' may be a typo, which is similar to vue component option 'methods'.`
        // {
        //   message: `'dat' may be a typo, which is similar to vue component option 'data'.`
        //   // suggestions: [
        //   //   {
        //   //     desc: `Replace property 'dat' to 'data'`,
        //   //     output: `
        //   //     export default {
        //   //       data: {},
        //   //       method: {}
        //   //     }
        //   //     `
        //   //   }
        //   // ]
        // },
        // {
        //   message: `'method' may be a typo, which is similar to vue component option 'methods'.`
        //   // suggestions: [
        //   //   {
        //   //     desc: `Replace property 'method' to 'methods'`,
        //   //     output: `
        //   //     export default {
        //   //       dat: {},
        //   //       methods: {}
        //   //     }
        //   //     `
        //   //   }
        //   // ]
        // }
      ]
    }
  ]
})
