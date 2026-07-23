/**
 * @author Kamogelo Moalusi <github.com/thesheppard>
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-restricted-v-on'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-restricted-v-on', rule as RuleModule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><button click="foo"></button></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><button :click="foo"></button></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @v-model="foo"></div></template>',
      options: ['foo']
    },
    {
      filename: 'test.vue',
      code: '<template><div @bar="foo"></div></template>',
      options: ['foo']
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="foo"></div></template>',
      options: ['foo']
    },
    {
      filename: 'test.vue',
      code: '<template><div @foo="foo"></div></template>',
      options: [{ argument: 'foo', modifiers: ['prevent'] }]
    },
    {
      filename: 'test.vue',
      code: '<template><div @foo="foo"></div></template>',
      options: [{ argument: 'foo', element: 'input' }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div @test="foo"></div></template>',
      options: ['test'],
      errors: [
        {
          message: 'Using `@test` is not allowed on this element.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @foo="bar" @bar="foo"></div></template>',
      options: ['foo'],
      errors: [
        {
          message: 'Using `@foo` is not allowed on this element.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @foo="bar" @bar="foo"></div></template>',
      options: ['foo', 'bar'],
      errors: [
        {
          message: 'Using `@foo` is not allowed on this element.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 20
        },
        {
          message: 'Using `@bar` is not allowed on this element.',
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @foo="bar" @bar="foo"></div></template>',
      options: [{ argument: '/^(foo|bar)$/' }],
      errors: [
        {
          message: 'Using `@foo` is not allowed on this element.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 20
        },
        {
          message: 'Using `@bar` is not allowed on this element.',
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @foo.once="foo" /><div @foo="foo" /></template>',
      options: [{ argument: 'foo', modifiers: ['once'] }],
      errors: [
        {
          message: 'Using `@foo.once` is not allowed on this element.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @v-on="foo" @foo.prevent="bar" /><div @foo="foo" v-on="listener" /></template>',
      options: ['/^v-/', { argument: 'foo', modifiers: ['prevent'] }, null],
      errors: [
        {
          message: 'Using `@v-on` is not allowed on this element.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 21
        },
        {
          message: 'Using `@foo.prevent` is not allowed on this element.',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 40
        },
        {
          message: 'Using `v-on` is not allowed on this element.',
          line: 1,
          column: 65,
          endLine: 1,
          endColumn: 69
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on="foo" /></template>',
      options: [null],
      errors: [
        {
          message: 'Using `v-on` is not allowed on this element.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @v-on @foo.once="bar" />
        <MyButton @foo="foo" @bar="bar" />
      </template>`,
      options: ['/^v-/', { argument: 'foo', element: `/^My/` }],
      errors: [
        {
          message: 'Using `@v-on` is not allowed on this element.',
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 19
        },
        {
          message: 'Using `@foo` is not allowed on this <MyButton>.',
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
        <div @foo="x" />
      </template>`,
      options: ['/^f/', { argument: 'foo' }],
      errors: [
        {
          message: 'Using `@foo` is not allowed on this element.',
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
        <div @foo="x" />
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
      code: '<template><div @foo="foo"></div></template>',
      options: [{ argument: 'foo', element: 'div' }],
      errors: [
        {
          message: 'Using `@foo` is not allowed on this <div>.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on:foo="foo"></div></template>',
      options: ['foo'],
      errors: [
        {
          message: 'Using `v-on:foo` is not allowed on this element.',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 24
        }
      ]
    }
  ]
})
