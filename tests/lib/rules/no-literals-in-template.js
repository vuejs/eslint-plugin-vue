/**
 * @author rzzf
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-literals-in-template')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-literals-in-template', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template><div :arr="myArray"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div :obj="myObject"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div :callback="myFunction"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind="myProps"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo="bar"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:[foo]="bar"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:[foo].camel="bar"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo.camel></div></template>'
    },
    // Excluded attributes
    {
      filename: 'test.vue',
      code: `<template><div :class="['active', errorClass]"></div></template>`
    },
    {
      filename: 'test.vue',
      code: '<template><div :class="{ active: isActive }"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:class="[]"></div></template>'
    },
    {
      filename: 'test.vue',
      code: `<template><div :style="{ color: 'red' }"></div></template>`
    },
    {
      filename: 'test.vue',
      code: '<template><div :style="[baseStyles, overridingStyles]"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:style="[]"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:style.camel="[]"></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div :arr="[]"></div></template>',
      errors: [
        {
          message: 'Unexpected array literal in template.',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :arr="[1,2,3]"></div></template>',
      errors: [
        {
          message: 'Unexpected array literal in template.',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :obj="{}"></div></template>',
      errors: [
        {
          message: 'Unexpected object literal in template.',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :obj="{name:'Tom', age: 123}"></div></template>`,
      errors: [
        {
          message: 'Unexpected object literal in template.',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 44
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :callback="() => someFunction(someArgs)"></div></template>',
      errors: [
        {
          message: 'Unexpected arrow function literal in template.',
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 55
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :callback="function() { return 1 }"></div></template>',
      errors: [
        {
          message: 'Unexpected function literal in template.',
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 50
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :arr="[...myArray]"></div></template>',
      errors: [
        {
          message: 'Unexpected array literal in template.',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :obj="{...myObject}"></div></template>',
      errors: [
        {
          message: 'Unexpected object literal in template.',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind="{foo: 1}"></div></template>',
      errors: [
        {
          message: 'Unexpected object literal in template.',
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo="{}"></div></template>',
      errors: [
        {
          message: 'Unexpected object literal in template.',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo="[]"></div></template>',
      errors: [
        {
          message: 'Unexpected array literal in template.',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo="() => someFunction(someArgs)"></div></template>',
      errors: [
        {
          message: 'Unexpected arrow function literal in template.',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 56
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo="function() { return 1 }"></div></template>',
      errors: [
        {
          message: 'Unexpected function literal in template.',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 51
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:[key]="{}"></div></template>',
      errors: [
        {
          message: 'Unexpected object literal in template.',
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:[key]="[]"></div></template>',
      errors: [
        {
          message: 'Unexpected array literal in template.',
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:[key]="() => someFunction(someArgs)"></div></template>',
      errors: [
        {
          message: 'Unexpected arrow function literal in template.',
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 58
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:[key]="function() { return 1 }"></div></template>',
      errors: [
        {
          message: 'Unexpected function literal in template.',
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 53
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :[key].camel="{}"></div></template>',
      errors: [
        {
          message: 'Unexpected object literal in template.',
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :[key].camel="[]"></div></template>',
      errors: [
        {
          message: 'Unexpected array literal in template.',
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :[key].camel="() => someFunction(someArgs)"></div></template>',
      errors: [
        {
          message: 'Unexpected arrow function literal in template.',
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 58
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :[key].camel="function() { return 1 }"></div></template>',
      errors: [
        {
          message: 'Unexpected function literal in template.',
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 53
        }
      ]
    }
  ]
})
