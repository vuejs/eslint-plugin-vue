/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import semver from 'semver'
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-export-in-script-setup'
import vueEslintParser from 'vue-eslint-parser'
import typescriptPackageJson from 'typescript/package.json' with { type: 'json' }

const ruleTester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
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
    ...(semver.satisfies(typescriptPackageJson.version, '>=4.5.0-0')
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
            languageOptions: {
              parser: vueEslintParser,
              parserOptions: {
                parser: require.resolve('@typescript-eslint/parser')
              }
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
            languageOptions: {
              parser: vueEslintParser,
              parserOptions: {
                parser: require.resolve('@typescript-eslint/parser')
              }
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
      export const test = '123'
      export function foo() {}
      const a = 1
      export { a }
      export { fao } from 'bar'
      </script>
      `,
      errors: [
        {
          message: '`<script setup>` cannot contain ES module exports.',
          line: 3,
          column: 7,
          endLine: 3,
          endColumn: 26
        },
        {
          message: '`<script setup>` cannot contain ES module exports.',
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 24
        },
        {
          message: '`<script setup>` cannot contain ES module exports.',
          line: 5,
          column: 7,
          endLine: 5,
          endColumn: 13
        },
        {
          message: '`<script setup>` cannot contain ES module exports.',
          line: 6,
          column: 7,
          endLine: 6,
          endColumn: 13
        },
        {
          message: '`<script setup>` cannot contain ES module exports.',
          line: 7,
          column: 7,
          endLine: 7,
          endColumn: 13
        },
        {
          message: '`<script setup>` cannot contain ES module exports.',
          line: 9,
          column: 7,
          endLine: 9,
          endColumn: 19
        },
        {
          message: '`<script setup>` cannot contain ES module exports.',
          line: 10,
          column: 7,
          endLine: 10,
          endColumn: 32
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
          line: 6,
          column: 7,
          endLine: 6,
          endColumn: 26
        },
        {
          message: '`<script setup>` cannot contain ES module exports.',
          line: 7,
          column: 7,
          endLine: 7,
          endColumn: 24
        },
        {
          message: '`<script setup>` cannot contain ES module exports.',
          line: 8,
          column: 7,
          endLine: 8,
          endColumn: 13
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
      languageOptions: {
        parser: vueEslintParser,
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: '`<script setup>` cannot contain ES module exports.',
          line: 3,
          column: 7,
          endLine: 3,
          endColumn: 13
        },
        {
          message: '`<script setup>` cannot contain ES module exports.',
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 13
        },
        {
          message: '`<script setup>` cannot contain ES module exports.',
          line: 5,
          column: 7,
          endLine: 5,
          endColumn: 16
        }
      ]
    }
  ]
})
