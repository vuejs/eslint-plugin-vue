/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/valid-v-else'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

tester.run('valid-v-else', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div v-else></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div v-else-if="foo"></div><div v-else></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: `<template>\n    <c1 v-if="1" />\n    <c2 v-else-if="1" />\n    <c3 v-else />\n</template>`
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><template v-else><div></div></template></template>',
      errors: [
        {
          message:
            "'v-else' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive.",
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-else></div></template>',
      errors: [
        {
          message:
            "'v-else' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-else></div></div></template>',
      errors: [
        {
          message:
            "'v-else' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive.",
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div></div><div v-else></div></div></template>',
      errors: [
        {
          message:
            "'v-else' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive.",
          line: 1,
          column: 32,
          endLine: 1,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div if="foo"></div><div v-else></div></div></template>',
      errors: [
        {
          message:
            "'v-else' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive.",
          line: 1,
          column: 41,
          endLine: 1,
          endColumn: 47
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div></div><div v-else></div></div></template>',
      errors: [
        {
          message:
            "'v-else' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive.",
          line: 1,
          column: 54,
          endLine: 1,
          endColumn: 60
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div v-else v-if="bar"></div></div></template>',
      errors: [
        {
          message:
            "'v-else' and 'v-if' directives can't exist on the same element. You may want 'v-else-if' directives.",
          line: 1,
          column: 43,
          endLine: 1,
          endColumn: 49
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div v-else v-else-if="foo"></div></div></template>',
      errors: [
        {
          message:
            "'v-else' and 'v-else-if' directives can't exist on the same element.",
          line: 1,
          column: 43,
          endLine: 1,
          endColumn: 49
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div v-else:aaa></div></div></template>',
      errors: [
        {
          message: "'v-else' directives require no argument.",
          line: 1,
          column: 50,
          endLine: 1,
          endColumn: 53
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div v-else.aaa></div></div></template>',
      errors: [
        {
          message: "'v-else' directives require no modifier.",
          line: 1,
          column: 50,
          endLine: 1,
          endColumn: 53
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div v-else="foo"></div></div></template>',
      errors: [
        {
          message: "'v-else' directives require no attribute value.",
          line: 1,
          column: 50,
          endLine: 1,
          endColumn: 55
        }
      ]
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: '<template><div v-if="foo"></div><div v-else="."></div></template>',
      errors: [
        {
          message: "'v-else' directives require no attribute value.",
          line: 1,
          column: 45,
          endLine: 1,
          endColumn: 48
        }
      ]
    },
    // comment value
    {
      filename: 'comment-value.vue',
      code: '<template><div v-if="foo"></div><div v-else="/**/"></div></template>',
      errors: [
        {
          message: "'v-else' directives require no attribute value.",
          line: 1,
          column: 45,
          endLine: 1,
          endColumn: 51
        }
      ]
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: '<template><div v-if="foo"></div><div v-else=""></div></template>',
      errors: [
        {
          message: "'v-else' directives require no attribute value.",
          line: 1,
          column: 45,
          endLine: 1,
          endColumn: 47
        }
      ]
    }
  ]
})
