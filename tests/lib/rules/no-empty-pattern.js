/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-empty-pattern')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2018 }
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
          line: 5,
          column: 17,
          endLine: 5,
          endColumn: 19
        },
        {
          message: 'Unexpected empty array pattern.',
          line: 6,
          column: 17,
          endLine: 6,
          endColumn: 19
        },
        {
          message: 'Unexpected empty object pattern.',
          line: 7,
          column: 21,
          endLine: 7,
          endColumn: 23
        },
        {
          message: 'Unexpected empty array pattern.',
          line: 8,
          column: 21,
          endLine: 8,
          endColumn: 23
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
          line: 4,
          column: 33,
          endLine: 4,
          endColumn: 35
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
          line: 4,
          column: 33,
          endLine: 4,
          endColumn: 35
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
          line: 4,
          column: 37,
          endLine: 4,
          endColumn: 39
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
          line: 4,
          column: 37,
          endLine: 4,
          endColumn: 39
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
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 23
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
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 23
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
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 27
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
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 27
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
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 25
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
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 25
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
          line: 4,
          column: 27,
          endLine: 4,
          endColumn: 29
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
          line: 4,
          column: 27,
          endLine: 4,
          endColumn: 29
        }
      ]
    }
  ]
})
