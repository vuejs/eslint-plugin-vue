/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/v-bind-style')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
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
      errors: ["Unexpected 'v-bind' before ':'."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo="foo"></div></template>',
      output: '<template><div :foo="foo"></div></template>',
      options: ['shorthand'],
      errors: ["Unexpected 'v-bind' before ':'."]
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo"></div></template>',
      output: '<template><div v-bind:foo="foo"></div></template>',
      options: ['longform'],
      errors: ["Expected 'v-bind' before ':'."]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo="foo"></div></template>',
      output: '<template><div v-bind:foo.prop="foo"></div></template>',
      options: ['longform'],
      errors: ["Expected 'v-bind:' instead of '.'."]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo.sync="foo"></div></template>',
      output: '<template><div v-bind:foo.prop.sync="foo"></div></template>',
      options: ['longform'],
      errors: ["Expected 'v-bind:' instead of '.'."]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo.prop="foo"></div></template>',
      output: '<template><div v-bind:foo.prop="foo"></div></template>',
      options: ['longform'],
      errors: ["Expected 'v-bind:' instead of '.'."]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo.sync.prop="foo"></div></template>',
      output: '<template><div v-bind:foo.sync.prop="foo"></div></template>',
      options: ['longform'],
      errors: ["Expected 'v-bind:' instead of '.'."]
    },
    // v-bind same-name shorthand (Vue 3.4+)
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo /></template>',
      output: '<template><div :foo /></template>',
      options: ['shorthand'],
      errors: ["Unexpected 'v-bind' before ':'."]
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo /></template>',
      output: '<template><div v-bind:foo /></template>',
      options: ['longform'],
      errors: ["Expected 'v-bind' before ':'."]
    },
    // same-name shorthand: never
    {
      filename: 'test.vue',
      code: '<template><div :foo /></template>',
      output: '<template><div :foo="foo" /></template>',
      options: ['shorthand', { sameNameShorthand: 'never' }],
      errors: [unexpectedShorthand]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo /></template>',
      output: '<template><div v-bind:foo="foo" /></template>',
      options: ['longform', { sameNameShorthand: 'never' }],
      errors: [unexpectedShorthand]
    },
    {
      // modifier
      filename: 'test.vue',
      code: '<template><div :foo.prop /></template>',
      output: '<template><div :foo.prop="foo" /></template>',
      options: ['shorthand', { sameNameShorthand: 'never' }],
      errors: [unexpectedShorthand]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo /></template>',
      output: '<template><div .foo="foo" /></template>',
      options: ['shorthand', { sameNameShorthand: 'never' }],
      errors: [unexpectedShorthand]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo /></template>',
      output: '<template><div v-bind:foo.prop /></template>',
      options: ['longform', { sameNameShorthand: 'never' }],
      errors: [unexpectedShorthand, "Expected 'v-bind:' instead of '.'."]
    },
    {
      // camel case
      filename: 'test.vue',
      code: '<template><div :foo-bar /></template>',
      output: '<template><div :foo-bar="fooBar" /></template>',
      options: ['shorthand', { sameNameShorthand: 'never' }],
      errors: [unexpectedShorthand]
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/2409
      filename: 'test.vue',
      code: '<template><div :foo_bar /></template>',
      output: '<template><div :foo_bar="foo_bar" /></template>',
      options: ['shorthand', { sameNameShorthand: 'never' }],
      errors: [unexpectedShorthand]
    },
    // same-name shorthand: always
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo" /></template>',
      output: '<template><div :foo /></template>',
      options: ['shorthand', { sameNameShorthand: 'always' }],
      errors: [expectedShorthand]
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo_bar="foo_bar" /></template>',
      output: '<template><div :foo_bar /></template>',
      options: ['shorthand', { sameNameShorthand: 'always' }],
      errors: [expectedShorthand]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo="foo" /></template>',
      output: '<template><div v-bind:foo /></template>',
      options: ['longform', { sameNameShorthand: 'always' }],
      errors: [expectedShorthand]
    },
    {
      // modifier
      filename: 'test.vue',
      code: '<template><div :foo.prop="foo" /></template>',
      output: '<template><div :foo.prop /></template>',
      options: ['shorthand', { sameNameShorthand: 'always' }],
      errors: [expectedShorthand]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo="foo" /></template>',
      output: '<template><div .foo /></template>',
      options: ['shorthand', { sameNameShorthand: 'always' }],
      errors: [expectedShorthand]
    },
    {
      // camel case
      filename: 'test.vue',
      code: '<template><div :foo-bar="fooBar" /></template>',
      output: '<template><div :foo-bar /></template>',
      options: ['shorthand', { sameNameShorthand: 'always' }],
      errors: [expectedShorthand]
    }
  ]
})
