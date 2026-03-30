/**
 * @fileoverview Enforces that a return statement is present in computed property (return-in-computed-property)
 * @author Armano
 */
import type { Linter } from 'eslint'
import rule from '../../../lib/rules/return-in-computed-property'
import { RuleTester } from '../../eslint-compat'

const languageOptions: Linter.LanguageOptions = {
  ecmaVersion: 6,
  sourceType: 'module'
}

const ruleTester = new RuleTester()
ruleTester.run('return-in-computed-property', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              return true
            },
            bar: function () {
              return false
            },
            bar3: {
              set () {
                return true
              },
              get () {
                return true
              }
            },
            bar4 () {
              if (foo) {
                return true
              } else {
                return false
              }
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
          computed: {
            foo () {
              const options = []
              this.matches.forEach((match) => {
                options.push(match)
              })
              return options
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
          computed: {
            foo () {
              const options = []
              this.matches.forEach(function (match) {
                options.push(match)
              })
              return options
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
          computed: {
            foo: {
              get () {
                return
              }
            }
          }
        }
      `,
      options: [{ treatUndefinedAsUnspecified: false }],
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        import {computed} from 'vue'
        export default {
          setup() {
            const foo = computed(() => true)
            const bar = computed(function() {
              return false
            })
            const bar3 = computed({
              set: () => true,
              get: () => true
            })
            const bar4 = computed(() => {
              if (foo) {
                return true
              } else {
                return false
              }
            })
            const foo2 = computed(() => {
              const options = []
              this.matches.forEach((match) => {
                options.push(match)
              })
              return options
            })
          }
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        import {computed} from 'vue'
        export default {
          setup() {
            const foo = computed({
              get: () => {
                return
              }
            })
          }
        }
      `,
      options: [{ treatUndefinedAsUnspecified: false }],
      languageOptions
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4,
          column: 17,
          endLine: 5,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
            }
          }
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4,
          column: 18,
          endLine: 5,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
              if (a) {
                return
              }
            }
          }
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4,
          column: 18,
          endLine: 8,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: {
              set () {
              },
              get () {
              }
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 7,
          column: 19,
          endLine: 8,
          endColumn: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
              function bar () {
                return this.baz * 2
              }
              bar()
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4,
          column: 18,
          endLine: 9,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
            },
            bar () {
              return
            }
          }
        }
      `,
      options: [{ treatUndefinedAsUnspecified: false }],
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4,
          column: 17,
          endLine: 5,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              return
            }
          }
        }
      `,
      options: [{ treatUndefinedAsUnspecified: true }],
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4,
          column: 17,
          endLine: 6,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        // @vue/component
        export default {
          computed: {
              my_FALSE_test() {
                  let aa = 2;
                  this.my_id = aa;
              }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message:
            'Expected to return a value in "my_FALSE_test" computed property.',
          line: 5,
          column: 28,
          endLine: 8,
          endColumn: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        import {computed} from 'vue'
        export default {
          setup() {
            const foo = computed(() => {})
            const foo2 = computed(function() {})
            const foo3 = computed(() => {
              if (a) {
                return
              }
            })
            const foo4 = computed({
              set: () => {},
              get: () => {}
            })
            const foo5 = computed(() => {
              const bar = () => {
                return this.baz * 2
              }
              bar()
            })
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in computed function.',
          line: 5,
          column: 34,
          endLine: 5,
          endColumn: 42
        },
        {
          message: 'Expected to return a value in computed function.',
          line: 6,
          column: 35,
          endLine: 6,
          endColumn: 48
        },
        {
          message: 'Expected to return a value in computed function.',
          line: 7,
          column: 35,
          endLine: 11,
          endColumn: 14
        },
        {
          message: 'Expected to return a value in computed function.',
          line: 14,
          column: 20,
          endLine: 14,
          endColumn: 28
        },
        {
          message: 'Expected to return a value in computed function.',
          line: 16,
          column: 35,
          endLine: 21,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        import {computed} from 'vue'
        export default {
          setup() {
            const foo = computed(() => {})
            const baz = computed(() => {
              return
            })
          }
        }
      `,
      options: [{ treatUndefinedAsUnspecified: false }],
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in computed function.',
          line: 5,
          column: 34,
          endLine: 5,
          endColumn: 42
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        'computed': {
          foo() {
          }
        }
      }`,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4,
          column: 14,
          endLine: 5,
          endColumn: 12
        }
      ]
    }
  ]
})
