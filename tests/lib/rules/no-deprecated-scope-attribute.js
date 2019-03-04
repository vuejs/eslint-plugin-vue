'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-deprecated-scope-attribute')

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2015
  }
})

tester.run('no-deprecated-scope-attribute', rule, {
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
        <a slot="name" />
      </LinkList>
    </template>`,
    `<template>
      <LinkList>
        <a slot-scope="{a}" />
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
          <template scope="{a}">
            <a />
          </template>
        </LinkList>
      </template>`,
      output: `
      <template>
        <LinkList>
          <template slot-scope="{a}">
            <a />
          </template>
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`scope` attributes are deprecated.',
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
          <template slot="name" slot-scope="{a}">
            <a />
          </template>
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`scope` attributes are deprecated.',
          line: 4
        }
      ]
    }
  ]
})
