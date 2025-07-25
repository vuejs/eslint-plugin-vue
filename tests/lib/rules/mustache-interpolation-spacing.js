/**
 * @fileoverview enforce unified spacing in mustache interpolations.
 * @author Armano
 */
'use strict'

const rule = require('../../../lib/rules/mustache-interpolation-spacing')
const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

ruleTester.run('mustache-interpolation-spacing', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template>             <div id="               "></div>         </template>'
    },
    {
      filename: 'test.vue',
      code: '<template> <div :style="  " :class="       foo      " v-if=foo   ></div>      </template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{ text }}</div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{ }}</div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{ }}</div></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{}}</div></template>',
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{text}}</div></template>',
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{ text }}</div></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{         }}</div></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{         }}</div></template>',
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{   text   }}</div></template>',
      options: ['always']
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div>{{ text}}</div></template>',
      output: '<template><div>{{ text }}</div></template>',
      options: ['always'],
      errors: [
        {
          message: "Expected 1 space before '}}', but not found.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{text }}</div></template>',
      output: '<template><div>{{ text }}</div></template>',
      options: ['always'],
      errors: [
        {
          message: "Expected 1 space after '{{', but not found.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{ text}}</div></template>',
      output: '<template><div>{{text}}</div></template>',
      options: ['never'],
      errors: [
        {
          message: "Expected no space after '{{', but found.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 19
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{text }}</div></template>',
      output: '<template><div>{{text}}</div></template>',
      options: ['never'],
      errors: [
        {
          message: "Expected no space before '}}', but found.",
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{text}}</div></template>',
      output: '<template><div>{{ text }}</div></template>',
      options: ['always'],
      errors: [
        {
          message: "Expected 1 space after '{{', but not found.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 18
        },
        {
          message: "Expected 1 space before '}}', but not found.",
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{ text }}</div></template>',
      output: '<template><div>{{text}}</div></template>',
      options: ['never'],
      errors: [
        {
          message: "Expected no space after '{{', but found.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 19
        },
        {
          message: "Expected no space before '}}', but found.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{   text   }}</div></template>',
      output: '<template><div>{{text}}</div></template>',
      options: ['never'],
      errors: [
        {
          message: "Expected no space after '{{', but found.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 21
        },
        {
          message: "Expected no space before '}}', but found.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 30
        }
      ]
    }
  ]
})
