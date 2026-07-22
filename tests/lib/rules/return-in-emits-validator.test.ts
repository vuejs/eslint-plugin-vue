/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import rule from '../../../lib/rules/return-in-emits-validator'
import { RuleTester } from '../../eslint-compat'
import { getTypeScriptFixtureTestOptions } from '../../test-utils/typescript'
import vueEslintParser from 'vue-eslint-parser'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})
ruleTester.run('return-in-emits-validator', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo () {
              return true
            },
            bar: function (e) {
              return true
            },
            baz: (e) => {
              return e
            },
            baz2: (e) => e,
            qux () {
              if (foo) {
                return true
              } else {
                return false
              }
            },
            quux: null,
            corge (evt) {
              return evt
            }
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo () {
              const options = []
              this.matches.forEach((match) => {
                options.push(match)
              })
              return options
            }
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: ['foo']
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo () {
              const options = []
              this.matches.forEach(function (match) {
                options.push(match)
              })
              return options
            }
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            a () {
              return 1n
            },
            b: function (e) {
              return 1
            },
            c: (e) => {
              return 'a'
            },
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
        defineEmits({
          foo () {
            return true
          }
        })
        </script>
      `
    },
    {
      code: `
      <script setup lang="ts">
      import {Emits1 as Emits} from './test01'
      const emit = defineEmits<Emits>()
      </script>`,
      ...getTypeScriptFixtureTestOptions()
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo () {
            }
          }
        }
        </script>
      `,
      errors: [
        {
          message:
            'Expected to return a boolean value in "foo" emits validator.',
          line: 5,
          column: 17,
          endLine: 6,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo: function () {
            }
          }
        }
        </script>
      `,
      errors: [
        {
          message:
            'Expected to return a boolean value in "foo" emits validator.',
          line: 5,
          column: 18,
          endLine: 6,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo: () => {
            }
          }
        }
        </script>
      `,
      errors: [
        {
          message:
            'Expected to return a boolean value in "foo" emits validator.',
          line: 5,
          column: 18,
          endLine: 6,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo: () => false
          }
        }
        </script>
      `,
      errors: [
        {
          message: 'Expected to return a true value in "foo" emits validator.',
          line: 5,
          column: 18,
          endLine: 5,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo: function () {
              function bar () {
                return this.baz * 2
              }
              bar()
            }
          }
        }
        </script>
      `,
      errors: [
        {
          message:
            'Expected to return a boolean value in "foo" emits validator.',
          line: 5,
          column: 18,
          endLine: 10,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo () {
            },
            bar () {
              return
            }
          }
        }
        </script>
      `,
      errors: [
        {
          message:
            'Expected to return a boolean value in "foo" emits validator.',
          line: 5,
          column: 17,
          endLine: 6,
          endColumn: 14
        },
        {
          message:
            'Expected to return a boolean value in "bar" emits validator.',
          line: 7,
          column: 17,
          endLine: 9,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo () {
              return
            }
          }
        }
        </script>
      `,
      errors: [
        {
          message:
            'Expected to return a boolean value in "foo" emits validator.',
          line: 5,
          column: 17,
          endLine: 7,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo: function () {
              if (a) {
                return false
              } else if (b) {
                return 0
              } else if (c) {
                return null
              } else if (d) {
                return ''
              } else if (e) {
                return undefined
              } else if (f) {
                return NaN
              } else if (g) {
                return 0n
              }
            }
          }
        }
        </script>
      `,
      errors: [
        {
          message: 'Expected to return a true value in "foo" emits validator.',
          line: 5,
          column: 18,
          endLine: 21,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
        defineEmits({
          foo () {
          }
        })
        </script>
      `,
      errors: [
        {
          message:
            'Expected to return a boolean value in "foo" emits validator.',
          line: 4,
          column: 15,
          endLine: 5,
          endColumn: 12
        }
      ]
    }
  ]
})
