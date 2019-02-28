'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-deprecated-slot-attribute.js')

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2015
  }
})

tester.run('no-deprecated-slot-attribute', rule, {
  valid: [
    `<template>
      <LinkList>
        <a v-slot:name />
      </LinkList>
    </template>`,
    `<template>
      <LinkList>
        <a #name />
      </LinkList>
    </template>`,
    `<template>
      <LinkList>
        <a v-slot="{a}" />
      </LinkList>
    </template>`,
    `<template>
      <LinkList>
        <a #default="{a}" />
      </LinkList>
    </template>`,
    `<template>
      <LinkList>
        <a />
      </LinkList>
    </template>`
  ],
  invalid: [
    {
      code: `
      <template>
        <LinkList>
          <a slot />
        </LinkList>
      </template>`,
      output: `
      <template>
        <LinkList>
          <a v-slot />
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a slot="name" />
        </LinkList>
      </template>`,
      output: `
      <template>
        <LinkList>
          <a v-slot:name />
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a slot="name" disabled slot-scope="{a}"/>
        </LinkList>
      </template>`,
      output: `
      <template>
        <LinkList>
          <a v-slot:name="{a}" disabled />
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <template slot="name" scope="{a}">
            <a />
          </template>
        </LinkList>
      </template>`,
      output: `
      <template>
        <LinkList>
          <template v-slot:name="{a}" >
            <a />
          </template>
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a slot="nameFoo" />
        </LinkList>
      </template>`,
      output: `
      <template>
        <LinkList>
          <a v-slot:nameFoo />
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a slot="f o o" />
          <a slot="obj.prop" />
          <a slot="a/b" />
          <a slot="a=b" />
          <a slot="a>b" />
        </LinkList>
      </template>`,
      output: null,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        },
        {
          message: '`slot` attributes are deprecated.',
          line: 5
        },
        {
          message: '`slot` attributes are deprecated.',
          line: 6
        },
        {
          message: '`slot` attributes are deprecated.',
          line: 7
        },
        {
          message: '`slot` attributes are deprecated.',
          line: 8
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a v-bind:slot=name />
        </LinkList>
      </template>`,
      output: `
      <template>
        <LinkList>
          <a v-slot:[name] />
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a :slot="slot.name" />
        </LinkList>
      </template>`,
      output: `
      <template>
        <LinkList>
          <a v-slot:[slot.name] />
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a :slot="  slotName  " />
        </LinkList>
      </template>`,
      output: `
      <template>
        <LinkList>
          <a v-slot:[slotName] />
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a :slot="slot. name" />
        </LinkList>
      </template>`,
      output: null,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a :slot="  " />
        </LinkList>
      </template>`,
      output: null,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a :slot="  .error  " />
        </LinkList>
      </template>`,
      output: null,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    }
  ]
})
