/**
 * @fileoverview Prevents duplication of field names.
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-dupe-keys')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('no-dupe-keys', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          props: ['foo'],
          computed: {
            bar () {
            }
          },
          data () {
            return {
              dat: null
            }
          },
          data () {
            return
          },
          methods: {
            _foo () {},
            test () {
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },

    {
      filename: 'test.vue',
      code: `
        export default {
          ...foo(),
          props: {
            ...foo(),
            foo: String
          },
          computed: {
            ...mapGetters({
              test: 'getTest'
            }),
            bar: {
              get () {
              }
            }
          },
          data: {
            ...foo(),
            dat: null
          },
          methods: {
            ...foo(),
            test () {
            }
          },
          data () {
            return {
              ...dat
            }
          },
        }
      `,
      parserOptions: { ecmaVersion: 2018, sourceType: 'module' }
    },

    {
      filename: 'test.js',
      code: `
        // @vue/component
        export const compA = {
          props: {
            propA: String
          }
        }

        // @vue/component
        export const compB = {
          props: {
            propA: String
          }
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
          props: ['foo'],
          computed: {
            foo () {
            }
          },
          data () {
            return {
              foo: null
            }
          },
          methods: {
            foo () {
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Duplicated key \'foo\'.',
        line: 5
      }, {
        message: 'Duplicated key \'foo\'.',
        line: 10
      }, {
        message: 'Duplicated key \'foo\'.',
        line: 14
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: String
          },
          computed: {
            foo: {
              get () {
              }
            }
          },
          data: {
            foo: null
          },
          methods: {
            foo () {
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Duplicated key \'foo\'.',
        line: 7
      }, {
        message: 'Duplicated key \'foo\'.',
        line: 13
      }, {
        message: 'Duplicated key \'foo\'.',
        line: 16
      }]
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          foo: {
            bar: String
          },
          data: {
            bar: null
          },
        })
      `,
      options: [{ groups: ['foo'] }],
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        message: 'Duplicated key \'bar\'.',
        line: 7
      }]
    }
  ]
})
