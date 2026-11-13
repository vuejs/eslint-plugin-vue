/**
 * @author Diogo Esteves
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/template-ref-pattern'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('template-ref-pattern', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <table ref="tableRef"></table>
        <FooBar ref="fooBarRef"></FooBar>
      </template>
      `,
      options: ['.+Ref$']
    },
    {
      // no pattern configured
      filename: 'test.vue',
      code: `
      <template>
        <table ref="table"></table>
      </template>
      `
    },
    {
      // dynamic refs are not checked
      filename: 'test.vue',
      code: `
      <template>
        <table :ref="table"></table>
        <div v-for="item in items" :ref="item.id"></div>
        <FooBar :ref="(el) => (fooBar = el)"></FooBar>
        <div :ref="\`\${name}\`"></div>
      </template>
      `,
      options: ['.+Ref$']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <table :ref="'tableRef'"></table>
        <FooBar v-bind:ref="\`fooBarRef\`"></FooBar>
      </template>
      `,
      options: ['.+Ref$']
    },
    {
      // ref without a value
      filename: 'test.vue',
      code: `
      <template>
        <table ref></table>
      </template>
      `,
      options: ['.+Ref$']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <table ref="TableREF"></table>
      </template>
      `,
      options: ['/ref$/i']
    },
    {
      // refs in script are not checked
      filename: 'test.vue',
      code: `
      <script setup>
      import { ref, useTemplateRef } from 'vue'
      const table = ref()
      const fooBar = useTemplateRef('fooBar')
      </script>
      `,
      options: ['.+Ref$']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <table ref="table"></table>
        <FooBar ref="fooBar"></FooBar>
      </template>
      `,
      options: ['.+Ref$'],
      errors: [
        {
          message:
            "Template ref name 'table' does not match the pattern '.+Ref$'.",
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 27
        },
        {
          message:
            "Template ref name 'fooBar' does not match the pattern '.+Ref$'.",
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <table ref="tableRef"></table>
        <FooBar ref="Ref"></FooBar>
        <div>
          <input ref="input-ref">
        </div>
      </template>
      `,
      options: ['^[a-z][a-zA-Z0-9]*Ref$'],
      errors: [
        {
          messageId: 'invalidRefName',
          data: { name: 'Ref', pattern: '^[a-z][a-zA-Z0-9]*Ref$' },
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 26
        },
        {
          messageId: 'invalidRefName',
          data: { name: 'input-ref', pattern: '^[a-z][a-zA-Z0-9]*Ref$' },
          line: 6,
          column: 22,
          endLine: 6,
          endColumn: 33
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <table :ref="'table'"></table>
        <FooBar v-bind:ref="\`fooBar\`"></FooBar>
      </template>
      `,
      options: ['.+Ref$'],
      errors: [
        {
          messageId: 'invalidRefName',
          data: { name: 'table', pattern: '.+Ref$' },
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 29
        },
        {
          messageId: 'invalidRefName',
          data: { name: 'fooBar', pattern: '.+Ref$' },
          line: 4,
          column: 29,
          endLine: 4,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <table ref="TableREF"></table>
        <FooBar ref="fooBar"></FooBar>
      </template>
      `,
      options: ['/ref$/i'],
      errors: [
        {
          messageId: 'invalidRefName',
          data: { name: 'fooBar', pattern: '/ref$/i' },
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 29
        }
      ]
    }
  ]
})
