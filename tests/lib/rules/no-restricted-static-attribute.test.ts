/**
 * @author Yosuke Ota
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-restricted-static-attribute'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2020 }
})

tester.run('no-restricted-static-attribute', rule as RuleModule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
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
      code: '<template><div v-model="foo"></div></template>',
      options: ['foo']
    },
    {
      filename: 'test.vue',
      code: '<template><div bar="foo"></div></template>',
      options: ['foo']
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo"></div></template>',
      options: ['foo']
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="foo"></div></template>',
      options: [{ key: 'foo', value: 'bar' }]
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="foo"></div><input bar></template>',
      options: [{ key: 'foo', element: 'input' }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div foo="foo"></div></template>',
      options: ['foo'],
      errors: [
        {
          message: 'Using `foo` is not allowed.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="bar" bar="foo"></div></template>',
      options: ['foo'],
      errors: [
        {
          message: 'Using `foo` is not allowed.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="foo" bar="bar"></div></template>',
      options: ['/^f/'],
      errors: [
        {
          message: 'Using `foo` is not allowed.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="bar" bar="foo"></div></template>',
      options: ['foo', 'bar'],
      errors: [
        {
          message: 'Using `foo` is not allowed.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 25
        },
        {
          message: 'Using `bar` is not allowed.',
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="bar" bar></div></template>',
      options: [{ key: '/^(foo|bar)$/' }],
      errors: [
        {
          message: 'Using `foo` is not allowed.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 25
        },
        {
          message: 'Using `bar` is not allowed.',
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="foo" /><div foo="bar" /></template>',
      options: [{ key: 'foo', value: 'bar' }],
      errors: [
        {
          message: 'Using `foo="bar"` is not allowed.',
          line: 1,
          column: 33,
          endLine: 1,
          endColumn: 42
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div foo v bar /><div foo="foo" vv="foo" bar="vfoo" /><div vvv="foo" bar="vv" /></template>',
      options: [
        '/^vv/',
        { key: 'foo', value: true },
        { key: 'bar', value: '/^vv/' }
      ],
      errors: [
        {
          message: 'Using `foo` set to `true` is not allowed.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 19
        },
        {
          message: 'Using `foo="foo"` is not allowed.',
          line: 1,
          column: 33,
          endLine: 1,
          endColumn: 42
        },
        {
          message: 'Using `vv` is not allowed.',
          line: 1,
          column: 43,
          endLine: 1,
          endColumn: 51
        },
        {
          message: 'Using `vvv` is not allowed.',
          line: 1,
          column: 70,
          endLine: 1,
          endColumn: 79
        },
        {
          message: 'Using `bar="vv"` is not allowed.',
          line: 1,
          column: 80,
          endLine: 1,
          endColumn: 88
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div foo />
        <MyButton foo bar />
      </template>`,
      options: [{ key: 'foo', element: `/^My/` }],
      errors: [
        {
          message: 'Using `foo` on `<MyButton>` is not allowed.',
          line: 4,
          column: 19,
          endLine: 4,
          endColumn: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div foo="x" />
      </template>`,
      options: ['/^f/', { key: 'foo' }],
      errors: [
        {
          message: 'Using `foo` is not allowed.',
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div foo="x" />
      </template>`,
      options: [{ key: 'foo', message: 'foo' }],
      errors: [
        {
          message: 'foo',
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 21
        }
      ]
    }
  ]
})
