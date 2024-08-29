/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/require-toggle-inside-transition')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('require-toggle-inside-transition', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><transition><div v-if="show" /></transition></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><transition><div v-show="show" /></transition></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><Transition><div v-if="show" /></Transition></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><Transition><div v-show="show" /></Transition></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><Transition><MyComp /></Transition></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><Transition><component :is="component" /></Transition></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><Transition><div :is="component" /></Transition></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><svg height="100" width="100"><transition><circle v-if="show" /></transition></svg> </template>'
    },
    {
      filename: 'test.vue',
      code: '<template><svg height="100" width="100"><transition><MyComponent /></transition></svg> </template>'
    },
    {
      filename: 'test.vue',
      code: '<template><transition><template v-if="show"><div /></template></transition></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><transition><slot /></transition></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><transition><div :key="k" /></transition></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><transition appear><div /></transition></template>'
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/2467
      filename: 'test.vue',
      code: '<template><transition :appear="foo"><div /></transition></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><transition :appear="true"><div /></transition></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><transition><dialog v-dialog="show" /></transition></template>',
      options: [
        {
          additionalDirectives: ['dialog']
        }
      ]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><transition><div /></transition></template>',
      errors: [
        {
          line: 1,
          column: 23,
          messageId: 'expected',
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><Transition><div /></Transition></template>',
      errors: [{ messageId: 'expected' }]
    },
    {
      filename: 'test.vue',
      code: '<template><transition><div /><div /></transition></template>',
      errors: [{ messageId: 'expected' }]
    },
    {
      filename: 'test.vue',
      code: '<template><transition><div v-for="e in list" /></transition></template>',
      errors: [{ messageId: 'expected' }]
    },
    {
      filename: 'test.vue',
      code: '<template><svg height="100" width="100"><transition><circle /></transition></svg> </template>',
      errors: [{ messageId: 'expected' }]
    },
    {
      filename: 'test.vue',
      code: '<template><transition><template v-for="e in list"><div /></template></transition></template>',
      errors: [{ messageId: 'expected' }]
    },
    {
      filename: 'test.vue',
      code: '<template><Transition>  <div /></Transition></template>',
      errors: [{ messageId: 'expected' }]
    },
    {
      filename: 'test.vue',
      code: '<template><transition :appear="false"><div /></transition></template>',
      errors: [{ messageId: 'expected' }]
    },
    {
      filename: 'test.vue',
      code: '<template><transition @appear="isLoaded"><div /></transition></template>',
      errors: [{ messageId: 'expected' }]
    },
    {
      filename: 'test.vue',
      code: '<template><transition><dialog v-dialog="show" /></transition></template>',
      options: [
        {
          additionalDirectives: []
        }
      ],
      errors: [
        {
          messageId: 'expected',
          data: { allowedDirectives: '`v-if` or `v-show`' }
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><transition><div v-custom="show" /></transition></template>',
      options: [
        {
          additionalDirectives: ['dialog']
        }
      ],
      errors: [
        {
          messageId: 'expected',
          data: { allowedDirectives: '`v-if`, `v-show` or `v-dialog`' }
        }
      ]
    }
  ]
})
