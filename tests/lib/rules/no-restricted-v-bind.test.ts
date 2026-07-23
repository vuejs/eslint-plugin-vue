/**
 * @author Yosuke Ota
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-restricted-v-bind'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2020 }
})

tester.run('no-restricted-v-bind', rule as RuleModule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div :v-model="foo"></div></template>',
      options: ['foo']
    },
    {
      filename: 'test.vue',
      code: '<template><div :bar="foo"></div></template>',
      options: ['foo']
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="foo"></div></template>',
      options: ['foo']
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo"></div></template>',
      options: [{ argument: 'foo', modifiers: ['sync'] }]
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo"></div></template>',
      options: [{ argument: 'foo', element: 'input' }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div :v-model="foo"></div></template>',
      errors: [
        {
          message:
            'Using `:v-xxx` is not allowed. Instead, remove `:` and use it as directive.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:v-model="foo"></div></template>',
      errors: [
        {
          message:
            'Using `:v-xxx` is not allowed. Instead, remove `:` and use it as directive.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="bar" :bar="foo"></div></template>',
      options: ['foo'],
      errors: [
        {
          message: 'Using `:foo` is not allowed.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="bar" :bar="foo"></div></template>',
      options: ['foo', 'bar'],
      errors: [
        {
          message: 'Using `:foo` is not allowed.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 20
        },
        {
          message: 'Using `:bar` is not allowed.',
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="bar" :bar.sync="foo"></div></template>',
      options: [{ argument: '/^(foo|bar)$/' }],
      errors: [
        {
          message: 'Using `:foo` is not allowed.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 20
        },
        {
          message: 'Using `:bar` is not allowed.',
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo.sync="foo" /><div :foo="foo" /></template>',
      options: [{ argument: 'foo', modifiers: ['sync'] }],
      errors: [
        {
          message: 'Using `:foo.sync` is not allowed.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :v-on :foo.sync /><div :foo="foo" v-bind="listener" /></template>',
      options: ['/^v-/', { argument: 'foo', modifiers: ['sync'] }, null],
      errors: [
        {
          message: 'Using `:v-on` is not allowed.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 21
        },
        {
          message: 'Using `:foo.sync` is not allowed.',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 31
        },
        {
          message: 'Using `v-bind` is not allowed.',
          line: 1,
          column: 50,
          endLine: 1,
          endColumn: 56
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :v-on :foo.sync />
        <MyButton :foo="foo" :bar="bar" />
      </template>`,
      options: ['/^v-/', { argument: 'foo', element: `/^My/` }],
      errors: [
        {
          message: 'Using `:v-on` is not allowed.',
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 19
        },
        {
          message: 'Using `:foo` on `<MyButton>` is not allowed.',
          line: 4,
          column: 19,
          endLine: 4,
          endColumn: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :foo="x" />
      </template>`,
      options: ['/^f/', { argument: 'foo' }],
      errors: [
        {
          message: 'Using `:foo` is not allowed.',
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 18
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :foo="x" />
      </template>`,
      options: [{ argument: 'foo', message: 'foo' }],
      errors: [
        {
          message: 'foo',
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 18
        }
      ]
    },

    {
      filename: 'test.vue',
      code: '<template><div :foo.attr="foo" /><div :bar.attr="foo" /></template>',
      options: [{ argument: 'foo', modifiers: ['attr'] }],
      errors: [
        {
          message: 'Using `:foo.attr` is not allowed.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 25
        }
      ]
    }
  ]
})
