/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const semver = require('semver')
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
    },
    ...(semver.gte(
      require('@typescript-eslint/parser/package.json').version,
      '5.4.0'
    ) &&
    semver.satisfies(require('typescript/package.json').version, '>=4.5.0-0')
      ? [
          {
            filename: 'test.vue',
            code: `
            <script setup lang="ts">
            export { type Foo } from "foo"
            export type Bar = {}
            export interface Bar {}
            </script>
            `,
            parser: require.resolve('vue-eslint-parser'),
            parserOptions: {
              parser: require.resolve('@typescript-eslint/parser')
            }
          }
        ]
      : [
          {
            filename: 'test.vue',
            code: `
            <script setup lang="ts">
            export type Bar = {}
            export interface Bar {}
            </script>
            `,
            parser: require.resolve('vue-eslint-parser'),
            parserOptions: {
              parser: require.resolve('@typescript-eslint/parser')
            }
          }
        ])
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
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      export const Foo = {}
      export enum Bar {}
      export {}
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
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
    }
  ]
})
