/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const eslint = require('eslint')
const rule = require('../../../lib/rules/no-export-in-script-setup')

const RuleTester = eslint.RuleTester
const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
})

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

ruleTester.run('no-export-in-script-setup', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export * from 'foo'
      export default {}
      export class A {}
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export * from 'foo'
      export default {}
      export class A {}
      </script>
      <script setup>
      let foo;
      </script>
      `
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
      export * from 'foo'
      export default {}
      export class A {}
      </script>
      `,
      errors: [
        {
          message: '`<script setup>` cannot contain ES module exports.',
          line: 3
        },
        {
          message: '`<script setup>` cannot contain ES module exports.',
          line: 4
        },
        {
          message: '`<script setup>` cannot contain ES module exports.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      let foo;
      </script>
      <script setup>
      export * from 'foo'
      export default {}
      export class A {}
      </script>
      `,
      errors: [
        {
          message: '`<script setup>` cannot contain ES module exports.',
          line: 6
        },
        {
          message: '`<script setup>` cannot contain ES module exports.',
          line: 7
        },
        {
          message: '`<script setup>` cannot contain ES module exports.',
          line: 8
        }
      ]
    }
  ]
})
