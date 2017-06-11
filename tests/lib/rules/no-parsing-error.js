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
const rule = require('../../../lib/rules/no-parsing-error')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-parsing-error', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template>a b c</template>'
    },
    {
      filename: 'test.vue',
      code: '<template>{{a + b + c}}</template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template>{{a b c}}</template>',
      errors: ['Parsing error: Unexpected token b.']
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{a b c}}</div></template>',
      errors: ['Parsing error: Unexpected token b.']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show="a b c">hello</div></template>',
      errors: ['Parsing error: Unexpected token b.']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show="a;b;">hello</div></template>',
      errors: ['Parsing error: Unexpected token ;.']
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{ }}</div></template>',
      errors: ['Parsing error: Expected an expression but got no code.']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show="">hello</div></template>',
      errors: ['Parsing error: Expected an expression but got no code.']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show=>hello</div></template>',
      errors: ['Parsing error: Expected an expression but got no code.']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="foo">hello</div></template>',
      errors: ['Parsing error: Unexpected token ).']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="foo() in list">hello</div></template>',
      errors: ['Parsing error: Assigning to rvalue.']
    }
  ]
})
