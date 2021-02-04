'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-deprecated-slot-scope-attribute')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2015
  }
})

tester.run('no-deprecated-slot-scope-attribute', rule, {
  valid: [
    `<template>
      <LinkList>
        <template v-slot:name><a /></template>
      </LinkList>
    </template>`,
    `<template>
      <LinkList>
        <template #name><a /></template>
      </LinkList>
    </template>`,
    `<template>
      <LinkList>
        <template v-slot="{a}"><a /></template>
      </LinkList>
    </template>`,
    `<template>
      <LinkList v-slot="{a}">
        <a />
      </LinkList>
    </template>`,
    `<template>
      <LinkList>
        <template #default="{a}"><a /></template>
      </LinkList>
    </template>`,
    `<template>
      <LinkList>
        <a slot="name" />
      </LinkList>
    </template>`,
    `<template>
      <LinkList>
        <template><a /></template>
      </LinkList>
    </template>`,
    `<template>
      <LinkList>
        <a />
      </LinkList>`
  ],
  invalid: [
    {
      code: `
      <template>
        <LinkList>
          <template slot-scope="{a}"><a /></template>
        </LinkList>
      </template>`,
      output: `
      <template>
        <LinkList>
          <template v-slot="{a}"><a /></template>
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`slot-scope` are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <template slot-scope><a /></template>
        </LinkList>
      </template>`,
      output: `
      <template>
        <LinkList>
          <template v-slot><a /></template>
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`slot-scope` are deprecated.',
          line: 4
        }
      ]
    },
    // cannot fix
    {
      code: `
      <template>
        <LinkList>
          <a slot-scope="{a}" />
        </LinkList>
      </template>`,
      output: null,
      errors: [
        {
          message: '`slot-scope` are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <template slot-scope="{a}" slot="foo"><a /></template>
        </LinkList>
      </template>`,
      output: null,
      errors: [
        {
          message: '`slot-scope` are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <template slot-scope="{a}" :slot="arg"><a /></template>
        </LinkList>
      </template>`,
      output: null,
      errors: [
        {
          message: '`slot-scope` are deprecated.',
          line: 4
        }
      ]
    }
  ]
})
