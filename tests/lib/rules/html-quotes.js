/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/html-quotes')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
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
    // avoidEscape
    {
      filename: 'test.vue',
      code: "<template><div attr='foo\"bar'></div></template>",
      options: ['double', { avoidEscape: true }]
    },
    {
      filename: 'test.vue',
      code: '<template><div attr="foo\'bar"></div></template>',
      options: ['single', { avoidEscape: true }]
    },
    // v-bind same-name shorthand (Vue 3.4+)
    {
      code: '<template><div :foo /></template>',
      options: ['double']
    },
    {
      code: '<template><div :foo /></template>',
      options: ['single']
    },

    // Invalid EOF
    {
      code: '<template><div class="foo></div></template>',
      options: ['single']
    },
    {
      code: "<template><div class='foo></div></template>",
      options: ['double']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div class=foo></div></template>',
      output: '<template><div class="foo"></div></template>',
      errors: [
        {
          message: 'Expected to be enclosed by double quotes.',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><div class='foo'></div></template>",
      output: '<template><div class="foo"></div></template>',
      errors: [
        {
          message: 'Expected to be enclosed by double quotes.',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :class=foo></div></template>',
      output: '<template><div :class="foo"></div></template>',
      errors: [
        {
          message: 'Expected to be enclosed by double quotes.',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><div :class='foo'></div></template>",
      output: '<template><div :class="foo"></div></template>',
      errors: [
        {
          message: 'Expected to be enclosed by double quotes.',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :class=foo+"bar"></div></template>',
      output: '<template><div :class="foo+&quot;bar&quot;"></div></template>',
      errors: [
        {
          message: 'Expected to be enclosed by double quotes.',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div class=foo></div></template>',
      output: '<template><div class="foo"></div></template>',
      options: ['double'],
      errors: [
        {
          message: 'Expected to be enclosed by double quotes.',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><div class='foo'></div></template>",
      output: '<template><div class="foo"></div></template>',
      options: ['double'],
      errors: [
        {
          message: 'Expected to be enclosed by double quotes.',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :class=foo></div></template>',
      output: '<template><div :class="foo"></div></template>',
      options: ['double'],
      errors: [
        {
          message: 'Expected to be enclosed by double quotes.',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><div :class='foo'></div></template>",
      output: '<template><div :class="foo"></div></template>',
      options: ['double'],
      errors: [
        {
          message: 'Expected to be enclosed by double quotes.',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :class=foo+"bar"></div></template>',
      output: '<template><div :class="foo+&quot;bar&quot;"></div></template>',
      options: ['double'],
      errors: [
        {
          message: 'Expected to be enclosed by double quotes.',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div class=foo></div></template>',
      output: "<template><div class='foo'></div></template>",
      options: ['single'],
      errors: [
        {
          message: 'Expected to be enclosed by single quotes.',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div class="foo"></div></template>',
      output: "<template><div class='foo'></div></template>",
      options: ['single'],
      errors: [
        {
          message: 'Expected to be enclosed by single quotes.',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :class=foo></div></template>',
      output: "<template><div :class='foo'></div></template>",
      options: ['single'],
      errors: [
        {
          message: 'Expected to be enclosed by single quotes.',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :class="foo"></div></template>',
      output: "<template><div :class='foo'></div></template>",
      options: ['single'],
      errors: [
        {
          message: 'Expected to be enclosed by single quotes.',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><div :class=foo+'bar'></div></template>",
      output: "<template><div :class='foo+&apos;bar&apos;'></div></template>",
      options: ['single'],
      errors: [
        {
          message: 'Expected to be enclosed by single quotes.',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    // avoidEscape
    {
      filename: 'test.vue',
      code: "<template><div attr='foo'></div></template>",
      output: '<template><div attr="foo"></div></template>',
      options: ['double', { avoidEscape: true }],
      errors: [
        {
          message: 'Expected to be enclosed by double quotes.',
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div attr="bar"></div></template>',
      output: "<template><div attr='bar'></div></template>",
      options: ['single', { avoidEscape: true }],
      errors: [
        {
          message: 'Expected to be enclosed by single quotes.',
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div attr=foo"bar></div></template>',
      output: "<template><div attr='foo\"bar'></div></template>",
      options: ['double', { avoidEscape: true }],
      errors: [
        {
          message: 'Expected to be enclosed by double quotes.',
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><div attr=foo'bar></div></template>",
      output: '<template><div attr="foo\'bar"></div></template>',
      options: ['single', { avoidEscape: true }],
      errors: [
        {
          message: 'Expected to be enclosed by single quotes.',
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div attr=foo"bar\'baz></div></template>',
      output: '<template><div attr="foo&quot;bar\'baz"></div></template>',
      options: ['double', { avoidEscape: true }],
      errors: [
        {
          message: 'Expected to be enclosed by double quotes.',
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div attr=foo"bar\'baz></div></template>',
      output: "<template><div attr='foo\"bar&apos;baz'></div></template>",
      options: ['single', { avoidEscape: true }],
      errors: [
        {
          message: 'Expected to be enclosed by single quotes.',
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 32
        }
      ]
    }
  ]
})
