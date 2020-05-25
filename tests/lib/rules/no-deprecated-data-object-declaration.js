/**
 * @fileoverview disallow using deprecated object declaration on data
 * @author yoyo930021
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-deprecated-data-object-declaration')

const RuleTester = require('eslint').RuleTester

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module'
}

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('no-deprecated-data-object-declaration', rule, {
  valid: [
    {
      filename: 'test.js',
      code: `
        createApp({
          data: function () {
            return {
              foo: 'bar'
            }
          }
        }).mount('#app')
      `,
      parserOptions
    },
    {
      filename: 'test.js',
      code: `
        createApp({
          ...data,
          data () {
            return {
              foo: 'bar'
            }
          }
        }).mount('#app')
      `,
      parserOptions
    },
    {
      filename: 'test.js',
      code: `
        const app = createApp(App)
        app.component('some-comp', {
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
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          data () {

          },
          methods: {

          }
        }
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          data () {

          },
          computed: {

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
        const app = createApp(App)
        app.component('some-comp', {
          data: {
            foo: 'bar'
          }
        })
      `,
      output: `
        const app = createApp(App)
        app.component('some-comp', {
          data: function() {
return {
            foo: 'bar'
          };
}
        })
      `,
      parserOptions,
      errors: [
        {
          message:
            "Object declaration on 'data' property is deprecated. Using function declaration instead.",
          line: 4
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
      parserOptions,
      errors: [
        {
          message:
            "Object declaration on 'data' property is deprecated. Using function declaration instead.",
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
      parserOptions,
      errors: [
        {
          message:
            "Object declaration on 'data' property is deprecated. Using function declaration instead.",
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
      parserOptions,
      errors: [
        {
          message:
            "Object declaration on 'data' property is deprecated. Using function declaration instead.",
          line: 3
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        createApp({
          data: {
            foo: 'bar'
          }
        })
      `,
      output: `
        createApp({
          data: function() {
return {
            foo: 'bar'
          };
}
        })
      `,
      parserOptions,
      errors: [
        {
          message:
            "Object declaration on 'data' property is deprecated. Using function declaration instead.",
          line: 3
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        createApp({
          data: {
            foo: 'bar'
          }
        }).mount('#app')
      `,
      output: `
        createApp({
          data: function() {
return {
            foo: 'bar'
          };
}
        }).mount('#app')
      `,
      parserOptions,
      errors: [
        {
          message:
            "Object declaration on 'data' property is deprecated. Using function declaration instead.",
          line: 3
        }
      ]
    }
  ]
})
