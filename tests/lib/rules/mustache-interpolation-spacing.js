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
      errors: [{
        message: 'Found none whitespaces, 1 expected.',
        type: 'VExpressionEnd'
      }]
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{text }}</div></template>',
      output: '<template><div>{{ text }}</div></template>',
      options: ['always'],
      errors: [{
        message: 'Found none whitespaces, 1 expected.',
        type: 'Identifier'
      }]
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{ text}}</div></template>',
      output: '<template><div>{{text}}</div></template>',
      options: ['never'],
      errors: [{
        message: 'Found 1 whitespaces, none expected.',
        type: 'Identifier'
      }]
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{text }}</div></template>',
      output: '<template><div>{{text}}</div></template>',
      options: ['never'],
      errors: [{
        message: 'Found 1 whitespaces, none expected.',
        type: 'VExpressionEnd'
      }]
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{text}}</div></template>',
      output: '<template><div>{{ text }}</div></template>',
      options: ['always'],
      errors: [{
        message: 'Found none whitespaces, 1 expected.',
        type: 'Identifier'
      }, {
        message: 'Found none whitespaces, 1 expected.',
        type: 'VExpressionEnd'
      }]
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{ text }}</div></template>',
      output: '<template><div>{{text}}</div></template>',
      options: ['never'],
      errors: [{
        message: 'Found 1 whitespaces, none expected.',
        type: 'Identifier'
      }, {
        message: 'Found 1 whitespaces, none expected.',
        type: 'VExpressionEnd'
      }]
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{   text   }}</div></template>',
      output: '<template><div>{{text}}</div></template>',
      options: ['never'],
      errors: [{
        message: 'Found 3 whitespaces, none expected.',
        type: 'Identifier'
      }, {
        message: 'Found 3 whitespaces, none expected.',
        type: 'VExpressionEnd'
      }]
    }
  ]
})
