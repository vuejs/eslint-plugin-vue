/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/v-bind-style'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

const expectedShorthand = 'Expected same-name shorthand.'
const unexpectedShorthand = 'Unexpected same-name shorthand.'

tester.run('v-bind-style', rule, {
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
      code: '<template><div :foo="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo"></div></template>',
      options: ['shorthand']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo="foo"></div></template>',
      options: ['longform', { sameNameShorthand: 'ignore' }]
    },

    // Don't enforce `.prop` shorthand because of experimental.
    {
      filename: 'test.vue',
      code: '<template><div :foo.prop="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo.prop="foo"></div></template>',
      options: ['shorthand']
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo="foo"></div></template>',
      options: ['shorthand']
    },
    // same-name shorthand: never
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo" /></template>',
      options: ['shorthand', { sameNameShorthand: 'never' }]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo="foo" /></template>',
      options: ['longform', { sameNameShorthand: 'never' }]
    },
    {
      // modifier
      filename: 'test.vue',
      code: `
      <template>
      <div :foo.prop="foo" />
      <div .foo="foo" />
      </template>
      `,
      options: ['shorthand', { sameNameShorthand: 'never' }]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo.prop="foo" /></template>',
      options: ['longform', { sameNameShorthand: 'never' }]
    },
    {
      // camel case
      filename: 'test.vue',
      code: '<template><div :foo-bar="fooBar" /></template>',
      options: ['shorthand', { sameNameShorthand: 'never' }]
    },
    // same-name shorthand: always
    {
      filename: 'test.vue',
      code: '<template><div :foo /></template>',
      options: ['shorthand', { sameNameShorthand: 'always' }]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo /></template>',
      options: ['longform', { sameNameShorthand: 'always' }]
    },
    {
      // modifier
      filename: 'test.vue',
      code: `
      <template>
      <div :foo.prop />
      <div .foo />
      </template>
      `,
      options: ['shorthand', { sameNameShorthand: 'always' }]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo.prop /></template>',
      options: ['longform', { sameNameShorthand: 'always' }]
    },
    {
      // camel case
      filename: 'test.vue',
      code: '<template><div :foo-bar/></template>',
      options: ['shorthand', { sameNameShorthand: 'always' }]
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/2409
      filename: 'test.vue',
      code: '<template><div :foo-bar="foo_bar" /></template>',
      options: ['shorthand', { sameNameShorthand: 'always' }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo="foo"></div></template>',
      output: '<template><div :foo="foo"></div></template>',
      errors: [
        {
          message: "Unexpected 'v-bind' before ':'.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo="foo"></div></template>',
      output: '<template><div :foo="foo"></div></template>',
      options: ['shorthand'],
      errors: [
        {
          message: "Unexpected 'v-bind' before ':'.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo"></div></template>',
      output: '<template><div v-bind:foo="foo"></div></template>',
      options: ['longform'],
      errors: [
        {
          message: "Expected 'v-bind' before ':'.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo="foo"></div></template>',
      output: '<template><div v-bind:foo.prop="foo"></div></template>',
      options: ['longform'],
      errors: [
        {
          message: "Expected 'v-bind:' instead of '.'.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo.sync="foo"></div></template>',
      output: '<template><div v-bind:foo.prop.sync="foo"></div></template>',
      options: ['longform'],
      errors: [
        {
          message: "Expected 'v-bind:' instead of '.'.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo.prop="foo"></div></template>',
      output: '<template><div v-bind:foo.prop="foo"></div></template>',
      options: ['longform'],
      errors: [
        {
          message: "Expected 'v-bind:' instead of '.'.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo.sync.prop="foo"></div></template>',
      output: '<template><div v-bind:foo.sync.prop="foo"></div></template>',
      options: ['longform'],
      errors: [
        {
          message: "Expected 'v-bind:' instead of '.'.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    // v-bind same-name shorthand (Vue 3.4+)
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo /></template>',
      output: '<template><div :foo /></template>',
      options: ['shorthand'],
      errors: [
        {
          message: "Unexpected 'v-bind' before ':'.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo /></template>',
      output: '<template><div v-bind:foo /></template>',
      options: ['longform'],
      errors: [
        {
          message: "Expected 'v-bind' before ':'.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    // same-name shorthand: never
    {
      filename: 'test.vue',
      code: '<template><div :foo /></template>',
      output: '<template><div :foo="foo" /></template>',
      options: ['shorthand', { sameNameShorthand: 'never' }],
      errors: [
        {
          message: unexpectedShorthand,
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo /></template>',
      output: '<template><div v-bind:foo="foo" /></template>',
      options: ['longform', { sameNameShorthand: 'never' }],
      errors: [
        {
          message: unexpectedShorthand,
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      // modifier
      filename: 'test.vue',
      code: '<template><div :foo.prop /></template>',
      output: '<template><div :foo.prop="foo" /></template>',
      options: ['shorthand', { sameNameShorthand: 'never' }],
      errors: [
        {
          message: unexpectedShorthand,
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo /></template>',
      output: '<template><div .foo="foo" /></template>',
      options: ['shorthand', { sameNameShorthand: 'never' }],
      errors: [
        {
          message: unexpectedShorthand,
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo /></template>',
      output: '<template><div v-bind:foo.prop /></template>',
      options: ['longform', { sameNameShorthand: 'never' }],
      errors: [
        {
          message: unexpectedShorthand,
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 20
        },
        {
          message: "Expected 'v-bind:' instead of '.'.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      // camel case
      filename: 'test.vue',
      code: '<template><div :foo-bar /></template>',
      output: '<template><div :foo-bar="fooBar" /></template>',
      options: ['shorthand', { sameNameShorthand: 'never' }],
      errors: [
        {
          message: unexpectedShorthand,
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/2409
      filename: 'test.vue',
      code: '<template><div :foo_bar /></template>',
      output: '<template><div :foo_bar="foo_bar" /></template>',
      options: ['shorthand', { sameNameShorthand: 'never' }],
      errors: [
        {
          message: unexpectedShorthand,
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    // same-name shorthand: always
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo" /></template>',
      output: '<template><div :foo /></template>',
      options: ['shorthand', { sameNameShorthand: 'always' }],
      errors: [
        {
          message: expectedShorthand,
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo_bar="foo_bar" /></template>',
      output: '<template><div :foo_bar /></template>',
      options: ['shorthand', { sameNameShorthand: 'always' }],
      errors: [
        {
          message: expectedShorthand,
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo="foo" /></template>',
      output: '<template><div v-bind:foo /></template>',
      options: ['longform', { sameNameShorthand: 'always' }],
      errors: [
        {
          message: expectedShorthand,
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      // modifier
      filename: 'test.vue',
      code: '<template><div :foo.prop="foo" /></template>',
      output: '<template><div :foo.prop /></template>',
      options: ['shorthand', { sameNameShorthand: 'always' }],
      errors: [
        {
          message: expectedShorthand,
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo="foo" /></template>',
      output: '<template><div .foo /></template>',
      options: ['shorthand', { sameNameShorthand: 'always' }],
      errors: [
        {
          message: expectedShorthand,
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      // camel case
      filename: 'test.vue',
      code: '<template><div :foo-bar="fooBar" /></template>',
      output: '<template><div :foo-bar /></template>',
      options: ['shorthand', { sameNameShorthand: 'always' }],
      errors: [
        {
          message: expectedShorthand,
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 33
        }
      ]
    }
  ]
})
