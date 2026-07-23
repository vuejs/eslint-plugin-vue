/**
 * @author Yosuke Ota
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-v-for-template-key-on-child'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

tester.run('no-v-for-template-key-on-child', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x in list"><Foo /></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x in list" :key="x"><Foo /></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x in list" :key="x.id"><Foo :key="x.id" /></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="(x, i) in list" :key="i"><Foo :key="x" /></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="(x, i) in list"><Foo :key="foo" /></template></div></template>'
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
      code: '<template><div><template v-for="x in list"><Foo :key="x" /></template></div></template>',
      errors: [
        {
          message:
            '`<template v-for>` key should be placed on the `<template>` tag.',
          line: 1,
          column: 49,
          endLine: 1,
          endColumn: 57
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x in list"><Foo :key="x.id" /></template></div></template>',
      errors: [
        {
          message:
            '`<template v-for>` key should be placed on the `<template>` tag.',
          line: 1,
          column: 49,
          endLine: 1,
          endColumn: 60
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x in list" :key="foo"><Foo :key="x.id" /></template></div></template>',
      errors: [
        {
          message:
            '`<template v-for>` key should be placed on the `<template>` tag.',
          line: 1,
          column: 60,
          endLine: 1,
          endColumn: 71
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x in list" :key><Foo :key="x.id" /></template></div></template>',
      errors: [
        {
          message:
            '`<template v-for>` key should be placed on the `<template>` tag.',
          line: 1,
          column: 54,
          endLine: 1,
          endColumn: 65
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x in list" :key><div /><Foo :key="x.id" /></template></div></template>',
      errors: [
        {
          message:
            '`<template v-for>` key should be placed on the `<template>` tag.',
          line: 1,
          column: 61,
          endLine: 1,
          endColumn: 72
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div><template v-for="x in list" :key><Foo :key="'foo' + x.id" /><Bar :key="'bar' + x.id" /></template></div></template>`,
      errors: [
        {
          message:
            '`<template v-for>` key should be placed on the `<template>` tag.',
          line: 1,
          column: 54,
          endLine: 1,
          endColumn: 73
        },
        {
          message:
            '`<template v-for>` key should be placed on the `<template>` tag.',
          line: 1,
          column: 81,
          endLine: 1,
          endColumn: 100
        }
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
          line: 9,
          column: 18,
          endLine: 9,
          endColumn: 33
        },
        {
          message:
            '`<template v-for>` key should be placed on the `<template>` tag.',
          line: 10,
          column: 18,
          endLine: 10,
          endColumn: 33
        },
        {
          message:
            '`<template v-for>` key should be placed on the `<template>` tag.',
          line: 11,
          column: 19,
          endLine: 11,
          endColumn: 34
        }
      ]
    }
  ]
})
