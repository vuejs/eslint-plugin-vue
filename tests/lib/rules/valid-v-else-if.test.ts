/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/valid-v-else-if'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

tester.run('valid-v-else-if', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div v-else-if="foo"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div v-else-if="foo"></div><div v-else-if="foo"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: `<template>\n    <c1 v-if="1" />\n    <c2 v-else-if="1" />\n    <c3 v-else />\n</template>`
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: '<template><div v-if="foo"></div><div v-else-if="."></div></template>'
    },
    // comment value (parsing error)
    {
      filename: 'comment-value.vue',
      code: '<template><div v-if="foo"></div><div v-else-if="/**/"></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><template v-else-if="foo"><div></div></template></template>',
      errors: [
        {
          message:
            "'v-else-if' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive.",
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-else-if="foo"></div></template>',
      errors: [
        {
          message:
            "'v-else-if' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-else-if="foo"></div></div></template>',
      errors: [
        {
          message:
            "'v-else-if' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive.",
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div></div><div v-else-if="foo"></div></div></template>',
      errors: [
        {
          message:
            "'v-else-if' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive.",
          line: 1,
          column: 32,
          endLine: 1,
          endColumn: 47
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div if="foo"></div><div v-else-if="foo"></div></div></template>',
      errors: [
        {
          message:
            "'v-else-if' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive.",
          line: 1,
          column: 41,
          endLine: 1,
          endColumn: 56
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div></div><div v-else-if="foo"></div></div></template>',
      errors: [
        {
          message:
            "'v-else-if' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive.",
          line: 1,
          column: 54,
          endLine: 1,
          endColumn: 69
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div v-else-if="foo" v-if="bar"></div></div></template>',
      errors: [
        {
          message:
            "'v-else-if' and 'v-if' directives can't exist on the same element.",
          line: 1,
          column: 43,
          endLine: 1,
          endColumn: 58
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div v-else-if="foo" v-else></div></div></template>',
      errors: [
        {
          message:
            "'v-else-if' and 'v-else' directives can't exist on the same element.",
          line: 1,
          column: 43,
          endLine: 1,
          endColumn: 58
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div v-else-if:aaa="foo"></div></div></template>',
      errors: [
        {
          message: "'v-else-if' directives require no argument.",
          line: 1,
          column: 53,
          endLine: 1,
          endColumn: 56
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div v-else-if.aaa="foo"></div></div></template>',
      errors: [
        {
          message: "'v-else-if' directives require no modifier.",
          line: 1,
          column: 53,
          endLine: 1,
          endColumn: 56
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div v-else-if></div></div></template>',
      errors: [
        {
          message: "'v-else-if' directives require that attribute value.",
          line: 1,
          column: 43,
          endLine: 1,
          endColumn: 52
        }
      ]
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: '<template><div v-if="foo"></div><div v-else-if=""></div></template>',
      errors: [
        {
          message: "'v-else-if' directives require that attribute value.",
          line: 1,
          column: 38,
          endLine: 1,
          endColumn: 50
        }
      ]
    }
  ]
})
