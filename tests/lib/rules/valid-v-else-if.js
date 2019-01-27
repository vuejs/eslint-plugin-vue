/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/valid-v-else-if')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
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
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><template v-else-if="foo"><div></div></template></template>',
      errors: ["'v-else-if' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-else-if="foo"></div></template>',
      errors: ["'v-else-if' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-else-if="foo"></div></div></template>',
      errors: ["'v-else-if' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div></div><div v-else-if="foo"></div></div></template>',
      errors: ["'v-else-if' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div if="foo"></div><div v-else-if="foo"></div></div></template>',
      errors: ["'v-else-if' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div></div><div v-else-if="foo"></div></div></template>',
      errors: ["'v-else-if' directives require being preceded by the element which has a 'v-if' or 'v-else-if' directive."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div v-else-if="foo" v-if="bar"></div></div></template>',
      errors: ["'v-else-if' and 'v-if' directives can't exist on the same element."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div v-else-if="foo" v-else></div></div></template>',
      errors: ["'v-else-if' and 'v-else' directives can't exist on the same element."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div v-else-if:aaa="foo"></div></div></template>',
      errors: ["'v-else-if' directives require no argument."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div v-else-if.aaa="foo"></div></div></template>',
      errors: ["'v-else-if' directives require no modifier."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div><div v-else-if></div></div></template>',
      errors: ["'v-else-if' directives require that attribute value."]
    }
  ]
})
