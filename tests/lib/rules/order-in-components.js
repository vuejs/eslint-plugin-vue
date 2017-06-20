/**
 * @fileoverview Keep order of properties in components
 * @author Michał Sajnóg
 */
'use strict'

const rule = require('../../../lib/rules/order-in-components')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

ruleTester.run('order-in-components', rule, {

  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'app',
          props: {
            propA: Number,
          },
          data () {
            return {
              msg: 'Welcome to Your Vue.js App'
            }
          },
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'app',
          data () {
            return {
              msg: 'Welcome to Your Vue.js App'
            }
          },
          props: {
            propA: Number,
          },
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "props" property should be above the "data" property on line 4.',
        line: 9
      }]
    }
  ]
})
