/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-empty-pattern')

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2018 }
})

tester.run('no-empty-pattern', rule, {
  valid: [
    `<template>
      <div
        @attr="() => {
          var {a = {}} = foo;
          var {a = []} = foo;
        }"
      />
    </template>`,
    `<template>
      <div
        @attr="function foo({a = {}}) {}"
      />
    </template>`,
    `<template>
      <div
        @attr="function foo({a = []}) {}"
      />
    </template>`,
    `<template>
      <div
        @attr="({a = {}}) => a"
      />
    </template>`,
    `<template>
      <div
        @attr="({a = []}) => a"
      />
    </template>`,
    `<template>
      <div
        slot-scope="{a = []}"
      />
    </template>`
  ],
  invalid: [
    {
      code: `
      <template>
        <div
          @attr="() => {
            var {} = foo;
            var [] = foo;
            var {a: {}} = foo;
            var {a: []} = foo;
          }"
        />
      </template>`,
      errors: [
        {
          message: 'Unexpected empty object pattern.',
          line: 5
        },
        {
          message: 'Unexpected empty array pattern.',
          line: 6
        },
        {
          message: 'Unexpected empty object pattern.',
          line: 7
        },
        {
          message: 'Unexpected empty array pattern.',
          line: 8
        }
      ]
    },
    {
      code: `
        <template>
          <div
            @attr="function foo({}) {}"
          />
        </template>`,
      errors: [
        {
          message: 'Unexpected empty object pattern.',
          line: 4
        }
      ]
    },
    {
      code: `
        <template>
          <div
            @attr="function foo([]) {}"
          />
        </template>`,
      errors: [
        {
          message: 'Unexpected empty array pattern.',
          line: 4
        }
      ]
    },
    {
      code: `
        <template>
          <div
            @attr="function foo({a: {}}) {}"
          />
        </template>`,
      errors: [
        {
          message: 'Unexpected empty object pattern.',
          line: 4
        }
      ]
    },
    {
      code: `
        <template>
          <div
            @attr="function foo({a: []}) {}"
          />
        </template>`,
      errors: [
        {
          message: 'Unexpected empty array pattern.',
          line: 4
        }
      ]
    },
    {
      code: `
        <template>
          <div
            @attr="({}) => foo()"
          />
        </template>`,
      errors: [
        {
          message: 'Unexpected empty object pattern.',
          line: 4
        }
      ]
    },
    {
      code: `
        <template>
          <div
            @attr="([]) => foo()"
          />
        </template>`,
      errors: [
        {
          message: 'Unexpected empty array pattern.',
          line: 4
        }
      ]
    },
    {
      code: `
        <template>
          <div
            @attr="({a: {}}) => a"
          />
        </template>`,
      errors: [
        {
          message: 'Unexpected empty object pattern.',
          line: 4
        }
      ]
    },
    {
      code: `
        <template>
          <div
            @attr="({a: []}) => a"
          />
        </template>`,
      errors: [
        {
          message: 'Unexpected empty array pattern.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <div
          slot-scope="{}"
        />
      </template>`,
      errors: [
        {
          message: 'Unexpected empty object pattern.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <div
          slot-scope="[]"
        />
      </template>`,
      errors: [
        {
          message: 'Unexpected empty array pattern.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <div
          slot-scope="{a: {}}"
        />
      </template>`,
      errors: [
        {
          message: 'Unexpected empty object pattern.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <div
          slot-scope="{a: []}"
        />
      </template>`,
      errors: [
        {
          message: 'Unexpected empty array pattern.',
          line: 4
        }
      ]
    }

  ]
})
