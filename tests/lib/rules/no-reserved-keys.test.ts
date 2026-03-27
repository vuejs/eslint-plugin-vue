/**
 * @fileoverview Prevent overwrite reserved keys
 * @author Armano
 */
import type { Linter } from 'eslint'
import rule from '../../../lib/rules/no-reserved-keys'
import { RuleTester } from '../../eslint-compat'
import vueEslintParser from 'vue-eslint-parser'

const languageOptions: Linter.LanguageOptions = {
  ecmaVersion: 2018,
  sourceType: 'module'
}

const ruleTester = new RuleTester()
ruleTester.run('no-reserved-keys', rule, {
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
          methods: {
            _foo () {},
            test () {
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
          props: ['foo'],
          computed: {
            bar () {
            }
          },
          data: () => {
            return {
              dat: null
            }
          },
          methods: {
            _foo () {},
            test () {
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
          props: ['foo'],
          computed: {
            bar () {
            }
          },
          data: () => ({
            dat: null
          }),
          methods: {
            _foo () {},
            test () {
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
          props: ['foo'],
          computed: {
            bar () {
            }
          },
          data: () => ({
            dat: null
          }),
          methods: {
            _foo () {},
            test () {
            }
          },
          setup () {
            return {
              _bar: () => {}
            }
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
        new Vue({
          props: {
            $el: String
          }
        })
      `,
      languageOptions: { ecmaVersion: 6 },
      errors: [
        {
          message: "Key '$el' is reserved.",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 16
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          setup () {
            return {
              $el: ''
            }
          }
        })
      `,
      languageOptions: { ecmaVersion: 6 },
      errors: [
        {
          message: "Key '$el' is reserved.",
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 18
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          asyncData () {
            return {
              $el: ''
            }
          }
        })
      `,
      languageOptions: { ecmaVersion: 6 },
      errors: [
        {
          message: "Key '$el' is reserved.",
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 18
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          data: {
            _foo: String
          }
        })
      `,
      languageOptions: { ecmaVersion: 6 },
      errors: [
        {
          message: "Keys starting with '_' are reserved in '_foo' group.",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 17
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          data: () => {
            return {
              _foo: String
            }
          }
        })
      `,
      languageOptions: { ecmaVersion: 6 },
      errors: [
        {
          message: "Keys starting with '_' are reserved in '_foo' group.",
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 19
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          data: () => ({
            _foo: String
          })
        })
      `,
      languageOptions: { ecmaVersion: 6 },
      errors: [
        {
          message: "Keys starting with '_' are reserved in '_foo' group.",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 17
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          asyncData: () => ({
            _foo: String
          })
        })
      `,
      languageOptions: { ecmaVersion: 6 },
      errors: [
        {
          message: "Keys starting with '_' are reserved in '_foo' group.",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 17
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          foo: {
            bar: String
          }
        })
      `,
      options: [{ reserved: ['bar'], groups: ['foo'] }],
      languageOptions: { ecmaVersion: 6 },
      errors: [
        {
          message: "Key 'bar' is reserved.",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        defineProps({
          $el: String
        })
      </script>
      `,
      languageOptions: { parser: vueEslintParser, ecmaVersion: 6 },
      errors: [
        {
          message: "Key '$el' is reserved.",
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
        defineProps<{$el: string}>()
      </script>
      `,
      languageOptions: {
        parser: vueEslintParser,
        ecmaVersion: 6,
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: "Key '$el' is reserved.",
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 33
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
        interface Props {
          $el: string
        }
        defineProps<Props>()
      </script>
      `,
      languageOptions: {
        parser: vueEslintParser,
        ecmaVersion: 6,
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: "Key '$el' is reserved.",
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
        type A = {
          $el: string
        }
        defineProps<A>()
      </script>
      `,
      languageOptions: {
        parser: vueEslintParser,
        ecmaVersion: 6,
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: "Key '$el' is reserved.",
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 22
        }
      ]
    }
  ]
})
