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
const rule = require('../../../lib/rules/html-quotes')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('html-quotes', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div class="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div :class="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div class="foo"></div></template>',
      options: ['double']
    },
    {
      filename: 'test.vue',
      code: '<template><div :class="foo"></div></template>',
      options: ['double']
    },
    {
      filename: 'test.vue',
      code: "<template><div class='foo'></div></template>",
      options: ['single']
    },
    {
      filename: 'test.vue',
      code: "<template><div :class='foo'></div></template>",
      options: ['single']
    },

    // Invalid EOF
    {
      code: '<template><div class="foo></div></template>',
      options: ['single']
    },
    {
      code: '<template><div class=\'foo></div></template>',
      options: ['double']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div class=foo></div></template>',
      output: '<template><div class="foo"></div></template>',
      errors: ['Expected to be enclosed by double quotes.']
    },
    {
      filename: 'test.vue',
      code: "<template><div class='foo'></div></template>",
      output: '<template><div class="foo"></div></template>',
      errors: ['Expected to be enclosed by double quotes.']
    },
    {
      filename: 'test.vue',
      code: '<template><div :class=foo></div></template>',
      output: '<template><div :class="foo"></div></template>',
      errors: ['Expected to be enclosed by double quotes.']
    },
    {
      filename: 'test.vue',
      code: "<template><div :class='foo'></div></template>",
      output: '<template><div :class="foo"></div></template>',
      errors: ['Expected to be enclosed by double quotes.']
    },
    {
      filename: 'test.vue',
      code: '<template><div :class=foo+"bar"></div></template>',
      output: '<template><div :class="foo+&quot;bar&quot;"></div></template>',
      errors: ['Expected to be enclosed by double quotes.']
    },
    {
      filename: 'test.vue',
      code: '<template><div class=foo></div></template>',
      output: '<template><div class="foo"></div></template>',
      options: ['double'],
      errors: ['Expected to be enclosed by double quotes.']
    },
    {
      filename: 'test.vue',
      code: "<template><div class='foo'></div></template>",
      output: '<template><div class="foo"></div></template>',
      options: ['double'],
      errors: ['Expected to be enclosed by double quotes.']
    },
    {
      filename: 'test.vue',
      code: '<template><div :class=foo></div></template>',
      output: '<template><div :class="foo"></div></template>',
      options: ['double'],
      errors: ['Expected to be enclosed by double quotes.']
    },
    {
      filename: 'test.vue',
      code: "<template><div :class='foo'></div></template>",
      output: '<template><div :class="foo"></div></template>',
      options: ['double'],
      errors: ['Expected to be enclosed by double quotes.']
    },
    {
      filename: 'test.vue',
      code: '<template><div :class=foo+"bar"></div></template>',
      output: '<template><div :class="foo+&quot;bar&quot;"></div></template>',
      options: ['double'],
      errors: ['Expected to be enclosed by double quotes.']
    },
    {
      filename: 'test.vue',
      code: '<template><div class=foo></div></template>',
      output: '<template><div class=\'foo\'></div></template>',
      options: ['single'],
      errors: ['Expected to be enclosed by single quotes.']
    },
    {
      filename: 'test.vue',
      code: '<template><div class="foo"></div></template>',
      output: '<template><div class=\'foo\'></div></template>',
      options: ['single'],
      errors: ['Expected to be enclosed by single quotes.']
    },
    {
      filename: 'test.vue',
      code: '<template><div :class=foo></div></template>',
      output: '<template><div :class=\'foo\'></div></template>',
      options: ['single'],
      errors: ['Expected to be enclosed by single quotes.']
    },
    {
      filename: 'test.vue',
      code: '<template><div :class="foo"></div></template>',
      output: '<template><div :class=\'foo\'></div></template>',
      options: ['single'],
      errors: ['Expected to be enclosed by single quotes.']
    },
    {
      filename: 'test.vue',
      code: "<template><div :class=foo+'bar'></div></template>",
      output: "<template><div :class='foo+&apos;bar&apos;'></div></template>",
      options: ['single'],
      errors: ['Expected to be enclosed by single quotes.']
    }
  ]
})
