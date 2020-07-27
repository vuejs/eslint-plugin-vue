/**
 * @fileoverview disallow using deprecated events api
 * @author yoyo930021
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-deprecated-events-api')

const RuleTester = require('eslint').RuleTester

const parserOptions = {
  ecmaVersion: 2020,
  sourceType: 'module'
}

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('no-deprecated-events-api', rule, {
  valid: [
    {
      filename: 'test.js',
      code: `
        createApp({
          mounted () {
            this.$emit('start')
          }
        })
      `,
      parserOptions
    },
    {
      filename: 'test.js',
      code: `
        createApp({
          methods: {
            click () {
              this.$emit('click')
            }
          }
        })
      `,
      parserOptions
    },
    {
      filename: 'test.js',
      code: `
        const another = function () {
          this.$on('start', args => {
            console.log('start')
          })
        }

        createApp({
          mounted () {
            this.$emit('start')
          }
        })
      `,
      parserOptions
    },
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          mounted () {
            this.$emit('start')
          }
        })
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          mounted () {
            this.$emit('start')
          }
        }
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        import mitt from 'mitt'
        const emitter = mitt()

        export default {
          setup () {
            emitter.on('foo', e => console.log('foo', e))
            emitter.emit('foo', { a: 'b' })
            emitter.off('foo', onFoo)
          }
        }
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          mounted () {
            a(this.$on)
          }
        }
      `,
      parserOptions
    },
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          mounted () {
            // It is OK because checking whether it is deprecated.
            this.$on?.('start', foo)
            this.$off?.('start', foo)
            this.$once?.('start', foo)
          }
        })
      `,
      parserOptions
    }
  ],

  invalid: [
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          mounted () {
            this.$on('start', function (args) {
              console.log('start', args)
            })
          }
        })
      `,
      parserOptions,
      errors: [
        {
          message:
            'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          mounted () {
            this.$off('start')
          }
        })
      `,
      parserOptions,
      errors: [
        {
          message:
            'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          mounted () {
            this.$once('start', function () {
              console.log('start')
            })
          }
        }
      `,
      parserOptions,
      errors: [
        {
          message:
            'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          mounted () {
            const vm = this
            vm.$on('start', function (args) {
              console.log('start', args)
            })
          }
        })
      `,
      parserOptions,
      errors: [
        {
          message:
            'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          mounted () {
            this?.$on('start')
            this?.$off('start')
            this?.$once('start')
          }
        })
      `,
      parserOptions,
      errors: [
        'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.',
        'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.',
        'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.'
      ]
    },
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          mounted () {
            ;(this?.$on)('start')
            ;(this?.$off)('start')
            ;(this?.$once)('start')
          }
        })
      `,
      parserOptions,
      errors: [
        'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.',
        'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.',
        'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.'
      ]
    }
  ]
})
