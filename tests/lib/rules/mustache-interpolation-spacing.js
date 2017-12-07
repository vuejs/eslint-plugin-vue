/**
 * @fileoverview enforce unified spacing in mustache interpolations.
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/mustache-interpolation-spacing')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
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
      errors: ["Expected 1 space before '}}', but not found."]
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{text }}</div></template>',
      output: '<template><div>{{ text }}</div></template>',
      options: ['always'],
      errors: ["Expected 1 space after '{{', but not found."]
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{ text}}</div></template>',
      output: '<template><div>{{text}}</div></template>',
      options: ['never'],
      errors: ["Expected no space after '{{', but found."]
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{text }}</div></template>',
      output: '<template><div>{{text}}</div></template>',
      options: ['never'],
      errors: ["Expected no space before '}}', but found."]
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{text}}</div></template>',
      output: '<template><div>{{ text }}</div></template>',
      options: ['always'],
      errors: [
        "Expected 1 space after '{{', but not found.",
        "Expected 1 space before '}}', but not found."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{ text }}</div></template>',
      output: '<template><div>{{text}}</div></template>',
      options: ['never'],
      errors: [
        "Expected no space after '{{', but found.",
        "Expected no space before '}}', but found."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{   text   }}</div></template>',
      output: '<template><div>{{text}}</div></template>',
      options: ['never'],
      errors: [
        "Expected no space after '{{', but found.",
        "Expected no space before '}}', but found."
      ]
    }
  ]
})
