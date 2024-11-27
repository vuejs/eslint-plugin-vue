/**
 * @fileoverview Enforces component's data property to be a function.
 * @author Armano
 */
'use strict'

const rule = require('../../../lib/rules/no-shared-component-data')

const RuleTester = require('../../eslint-compat').RuleTester

const languageOptions = {
  ecmaVersion: 2018,
  sourceType: 'module'
}

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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          ...foo
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          data
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          data: () => {

          }
        }
      `,
      languageOptions
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
      languageOptions,
      errors: [
        {
          message: '`data` property in component must be a function.',
          line: 3
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          data: {
            foo: 'bar'
          }
        })
      `,
      output: `
        app.component('some-comp', {
          data: function() {
return {
            foo: 'bar'
          };
}
        })
      `,
      languageOptions,
      errors: [
        {
          message: '`data` property in component must be a function.',
          line: 3
        }
      ]
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
      languageOptions,
      errors: [
        {
          message: '`data` property in component must be a function.',
          line: 3
        }
      ]
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
      languageOptions,
      errors: [
        {
          message: '`data` property in component must be a function.',
          line: 3
        }
      ]
    }
  ]
})
