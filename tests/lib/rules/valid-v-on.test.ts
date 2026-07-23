/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/valid-v-on'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

tester.run('valid-v-on', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on:click="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @click.prevent.ctrl.left="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.27="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.enter="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.arrow-down="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.esc="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.a="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.b="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.a.b.c="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><el-from @submit.native.prevent></el-form></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on:click.prevent></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on:click.native.stop></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on="$listeners"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on="{a, b, c: d}"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.bar="foo"></div></template>',
      options: [{ modifiers: ['bar'] }]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on:keydown.bar.aaa="foo"></div></template>',
      options: [{ modifiers: ['bar', 'aaa'] }]
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: '<template><MyComponent v-on:keydown="." /></template>'
    },
    // comment value (valid)
    {
      filename: 'comment-value.vue',
      code: '<template><MyComponent v-on:keydown="/**/" /></template>'
    },
    {
      filename: 'comment-value.vue',
      code: '<template><MyComponent v-on:keydown=/**/ /></template>'
    },
    {
      filename: 'comment-value.vue',
      code: '<template><MyComponent v-on:keydown.stop="/**/" /></template>'
    },
    {
      filename: 'comment-value.vue',
      code: '<template><MyComponent v-on:keydown.stop=/**/ /></template>'
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: '<template><MyComponent v-on:keydown.stop="" /></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-on:click.aaa="foo"></div></template>',
      errors: [
        {
          message: "'v-on' directives don't support the modifier 'aaa'.",
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on:click></div></template>',
      errors: [
        {
          message:
            "'v-on' directives require a value or verb modifier (like 'stop' or 'prevent').",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @click></div></template>',
      errors: [
        {
          message:
            "'v-on' directives require a value or verb modifier (like 'stop' or 'prevent').",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.bar.aaa="foo"></div></template>',
      options: [{ modifiers: ['bar'] }],
      errors: [
        {
          message: "'v-on' directives don't support the modifier 'aaa'.",
          line: 1,
          column: 29,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.bar.aaa="foo"></div></template>',
      options: [{ modifiers: ['aaa'] }],
      errors: [
        {
          message: "'v-on' directives don't support the modifier 'bar'.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="const"></div></template>',
      errors: [
        {
          message: 'Avoid using JavaScript keyword as "v-on" value: "const".',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="delete"></div></template>',
      errors: [
        {
          message: 'Avoid using JavaScript keyword as "v-on" value: "delete".',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: '<template><MyComponent v-on:keydown="" /></template>',
      errors: [
        {
          message:
            "'v-on' directives require a value or verb modifier (like 'stop' or 'prevent').",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 39
        }
      ]
    }
  ]
})
