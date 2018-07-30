/**
 * @fileoverview Enforces component's data property to be a function.
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-shared-component-data')

const RuleTester = require('eslint').RuleTester

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module'
}

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('no-shared-component-data', rule, {

  valid: [
    {
      filename: 'test.js',
      code: `
        new Vue({
          data: function () {
            return {
              foo: 'bar'
            }
          }
        })
      `,
      parserOptions
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          ...data,
          data () {
            return {
              foo: 'bar'
            }
          }
        })
      `,
      parserOptions
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          data: {
            foo: 'bar'
          }
        })
      `
    },
    {
      filename: 'test.js',
      code: `
        Vue.component('some-comp', {
          data: function () {
            return {
              foo: 'bar'
            }
          }
        })
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          data: function () {
            return {
              foo: 'bar'
            }
          }
        }
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          ...foo
        }
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          data
        }
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          data: () => {

          }
        }
      `,
      parserOptions
    }
  ],

  invalid: [
    {
      filename: 'test.js',
      code: `
        Vue.component('some-comp', {
          data: {
            foo: 'bar'
          }
        })
      `,
      output: `
        Vue.component('some-comp', {
          data: function() {
return {
            foo: 'bar'
          };
}
        })
      `,
      parserOptions,
      errors: [{
        message: '`data` property in component must be a function.',
        line: 3
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          data: {
            foo: 'bar'
          }
        }
      `,
      output: `
        export default {
          data: function() {
return {
            foo: 'bar'
          };
}
        }
      `,
      parserOptions,
      errors: [{
        message: '`data` property in component must be a function.',
        line: 3
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          data: /*a*/ (/*b*/{
            foo: 'bar'
          })
        }
      `,
      output: `
        export default {
          data: /*a*/ function() {
return (/*b*/{
            foo: 'bar'
          });
}
        }
      `,
      parserOptions,
      errors: [{
        message: '`data` property in component must be a function.',
        line: 3
      }]
    }
  ]
})
