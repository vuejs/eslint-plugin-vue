/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-lone-template')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  }
})

tester.run('no-lone-template', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <template v-if="foo">...</template>
        <template v-else-if="bar">...</template>
        <template v-else>...</template>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template v-for="e in list">...</template>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template v-slot>...</template>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <CoolButton>
         <template slot="foo">...</template>
        </CoolButton>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <CoolButton>
         <template slot-scope="foo">...</template>
        </CoolButton>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <CoolButton>
         <template scope="foo">...</template>
        </CoolButton>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template id="a">...</template>
      </template>
      `,
      options: [{ ignoreAccessible: true }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template :id="a">...</template>
      </template>
      `,
      options: [{ ignoreAccessible: true }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template ref="b">...</template>
      </template>
      `,
      options: [{ ignoreAccessible: true }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template :ref="b">...</template>
      </template>
      `,
      options: [{ ignoreAccessible: true }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <template>...</template>
      </template>
      `,
      errors: [
        {
          message: '`<template>` require directive.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 19
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template/>
      </template>
      `,
      errors: ['`<template>` require directive.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template v-on:id="a">...</template>
      </template>
      `,
      options: [{ ignoreAccessible: true }],
      errors: ['`<template>` require directive.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template v-bind="id">...</template>
      </template>
      `,
      options: [{ ignoreAccessible: true }],
      errors: ['`<template>` require directive.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template v-bind:[foo]="id">...</template>
      </template>
      `,
      options: [{ ignoreAccessible: true }],
      errors: ['`<template>` require directive.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template class="b">...</template>
      </template>
      `,
      options: [{ ignoreAccessible: true }],
      errors: ['`<template>` require directive.']
    }
  ]
})
