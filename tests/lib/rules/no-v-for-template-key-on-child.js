/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-v-for-template-key-on-child')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-v-for-template-key-on-child', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><template v-for="x in list"><Foo /></template></div></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><template v-for="x in list" :key="x"><Foo /></template></div></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><template v-for="x in list" :key="x.id"><Foo :key="x.id" /></template></div></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><template v-for="(x, i) in list" :key="i"><Foo :key="x" /></template></div></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><template v-for="(x, i) in list"><Foo :key="foo" /></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <template v-for="x in list">
            <Foo v-if="a" :key="x" />
          </template>
        </div>
      </template>`
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <template v-for="x in list">
            <Foo v-if="a" :key="x.key1" />
            <Foo v-else-if="a" :key="x.key2" />
            <Foo v-else :key="x.key3" />
            <Foo v-for="y in list" :key="x.key4" />
          </template>
        </div>
      </template>`
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code:
        '<template><div><template v-for="x in list"><Foo :key="x" /></template></div></template>',
      errors: [
        {
          message:
            '`<template v-for>` key should be placed on the `<template>` tag.',
          column: 49
        }
      ]
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><template v-for="x in list"><Foo :key="x.id" /></template></div></template>',
      errors: [
        '`<template v-for>` key should be placed on the `<template>` tag.'
      ]
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><template v-for="x in list" :key="foo"><Foo :key="x.id" /></template></div></template>',
      errors: [
        '`<template v-for>` key should be placed on the `<template>` tag.'
      ]
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><template v-for="x in list" :key><Foo :key="x.id" /></template></div></template>',
      errors: [
        '`<template v-for>` key should be placed on the `<template>` tag.'
      ]
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><template v-for="x in list" :key><div /><Foo :key="x.id" /></template></div></template>',
      errors: [
        '`<template v-for>` key should be placed on the `<template>` tag.'
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div><template v-for="x in list" :key><Foo :key="'foo' + x.id" /><Bar :key="'bar' + x.id" /></template></div></template>`,
      errors: [
        '`<template v-for>` key should be placed on the `<template>` tag.',
        '`<template v-for>` key should be placed on the `<template>` tag.'
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <template v-for="x in list">
            <Foo v-if="a" :key="x.key1" />
            <Foo v-else-if="a" :key="x.key2" />
            <Foo v-else :key="x.key3" />
            <Foo v-for="y in list" :key="x.key4" />
            <Foo :key="x.error1" />
            <div :key="x.error2" />
            <slot :key="x.error3" ></slot>
          </template>
        </div>
      </template>`,
      errors: [
        {
          message:
            '`<template v-for>` key should be placed on the `<template>` tag.',
          line: 9
        },
        {
          message:
            '`<template v-for>` key should be placed on the `<template>` tag.',
          line: 10
        },
        {
          message:
            '`<template v-for>` key should be placed on the `<template>` tag.',
          line: 11
        }
      ]
    }
  ]
})
