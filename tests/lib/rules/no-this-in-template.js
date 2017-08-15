/**
 * @fileoverview Disallow usage of `this` in template.
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-this-in-template')

const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

ruleTester.run('no-this-in-template', rule, {
  valid: [
    '',
    '<template></template>',
    '<template><div></div></template>',
    '<template><div>{{ foo.bar }}</div></template>',
    '<template><div v-for="foo in bar">{{ foo }}</div></template>',
    '<template><div v-if="foo">{{ foo }}</div></template>',
    '<template><div :class="foo">{{ foo }}</div></template>',
    '<template><div :class="{this: foo}">{{ foo }}</div></template>'
  ],
  invalid: [
    {
      code: '<template><div>{{ this.foo }}</div></template>',
      errors: [{
        message: "Unexpected usage of 'this'.",
        type: 'ThisExpression'
      }]
    },
    {
      code: '<template><div :class="this.foo"></div></template>',
      errors: [{
        message: "Unexpected usage of 'this'.",
        type: 'ThisExpression'
      }]
    },
    {
      code: '<template><div :class="{foo: this.foo}"></div></template>',
      errors: [{
        message: "Unexpected usage of 'this'.",
        type: 'ThisExpression'
      }]
    },
    {
      code: '<template><div :class="{foo: this.foo()}"></div></template>',
      errors: [{
        message: "Unexpected usage of 'this'.",
        type: 'ThisExpression'
      }]
    },
    {
      code: '<template><div v-if="this.foo"></div></template>',
      errors: [{
        message: "Unexpected usage of 'this'.",
        type: 'ThisExpression'
      }]
    },
    {
      code: '<template><div v-for="foo in this.bar"></div></template>',
      errors: [{
        message: "Unexpected usage of 'this'.",
        type: 'ThisExpression'
      }]
    }
  ]
})
