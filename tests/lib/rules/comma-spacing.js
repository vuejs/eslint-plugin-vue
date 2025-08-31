/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/comma-spacing')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2020 }
})

tester.run('comma-spacing', rule, {
  valid: [
    `<template>
      <button @click="
        var foo = 1, bar = 2;
      ">
        OK
      </button>
    </template>`,
    `<template>
      <DateInput :value="[2000, 12, 31]" />
    </template>`,
    `<template>
      <DateInput :value="{y: 2000, m: 12, d: 31}" />
    </template>`,
    `<template>
      <CustomDlg @ok="foo(a, b)" />
    </template>`,
    `<template>
      <CustomDlg @ok="(a, b) => {}" />
    </template>`,
    `<template>
      <CustomDlg @ok="function (a, b) {}" />
    </template>`,
    `<template>
      <CustomList>
        <li slot-scope="a, b">{{ a }}</li>
      </CustomList>
    </template>`,
    {
      code: `
        <template>
          <button @click="
            fn(a ,b)
          "/>
        </template>`,
      options: [{ before: true, after: false }]
    },
    `<template>
      <div :[fn(a,b)]="val" />
    </template>`,
    `<template>
      <div :[[,]]="val" />
    </template>`,
    `<template>
      <div :[a,]="val" />
    </template>`,
    `<script>
    fn = (a,b) => {}
    </script>`,
    `fn = (a,b) => {}`,
    // CSS vars injection
    `
    <style>
    .text {
      color: v-bind('foo(a, b)')
    }
    </style>`
  ],
  invalid: [
    {
      code: `
        <template>
          <button @click="
            var foo = 1 ,bar = 2;
          ">
            NG
          </button>
        </template>`,
      output: `
        <template>
          <button @click="
            var foo = 1, bar = 2;
          ">
            NG
          </button>
        </template>`,
      errors: [
        {
          message: "There should be no space before ','.",
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 26
        },
        {
          message: "A space is required after ','.",
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 26
        }
      ]
    },
    {
      code: `
        <template>
          <DateInput :value="[2000 ,12 ,31]" />
        </template>`,
      output: `
        <template>
          <DateInput :value="[2000, 12, 31]" />
        </template>`,
      errors: [
        {
          message: "There should be no space before ','.",
          line: 3,
          column: 36,
          endLine: 3,
          endColumn: 37
        },
        {
          message: "A space is required after ','.",
          line: 3,
          column: 36,
          endLine: 3,
          endColumn: 37
        },
        {
          message: "There should be no space before ','.",
          line: 3,
          column: 40,
          endLine: 3,
          endColumn: 41
        },
        {
          message: "A space is required after ','.",
          line: 3,
          column: 40,
          endLine: 3,
          endColumn: 41
        }
      ]
    },
    {
      code: `
        <template>
          <DateInput :value="{y: 2000 ,m: 12 ,d: 31}" />
        </template>`,
      output: `
        <template>
          <DateInput :value="{y: 2000, m: 12, d: 31}" />
        </template>`,
      errors: [
        {
          message: "There should be no space before ','.",
          line: 3,
          column: 39,
          endLine: 3,
          endColumn: 40
        },
        {
          message: "A space is required after ','.",
          line: 3,
          column: 39,
          endLine: 3,
          endColumn: 40
        },
        {
          message: "There should be no space before ','.",
          line: 3,
          column: 46,
          endLine: 3,
          endColumn: 47
        },
        {
          message: "A space is required after ','.",
          line: 3,
          column: 46,
          endLine: 3,
          endColumn: 47
        }
      ]
    },
    {
      code: `
        <template>
          <CustomDlg @ok="foo(a ,b)" />
        </template>`,
      output: `
        <template>
          <CustomDlg @ok="foo(a, b)" />
        </template>`,
      errors: [
        {
          message: "There should be no space before ','.",
          line: 3,
          column: 33,
          endLine: 3,
          endColumn: 34
        },
        {
          message: "A space is required after ','.",
          line: 3,
          column: 33,
          endLine: 3,
          endColumn: 34
        }
      ]
    },
    {
      code: `
        <template>
          <CustomDlg @ok="(a ,b) => {}" />
        </template>`,
      output: `
        <template>
          <CustomDlg @ok="(a, b) => {}" />
        </template>`,
      errors: [
        {
          message: "There should be no space before ','.",
          line: 3,
          column: 30,
          endLine: 3,
          endColumn: 31
        },
        {
          message: "A space is required after ','.",
          line: 3,
          column: 30,
          endLine: 3,
          endColumn: 31
        }
      ]
    },
    {
      code: `
        <template>
          <CustomDlg @ok="function (a ,b) {}" />
        </template>`,
      output: `
        <template>
          <CustomDlg @ok="function (a, b) {}" />
        </template>`,
      errors: [
        {
          message: "There should be no space before ','.",
          line: 3,
          column: 39,
          endLine: 3,
          endColumn: 40
        },
        {
          message: "A space is required after ','.",
          line: 3,
          column: 39,
          endLine: 3,
          endColumn: 40
        }
      ]
    },
    {
      code: `
        <template>
          <CustomList>
            <li slot-scope="a ,b">{{ a }}</li>
          </CustomList>
        </template>`,
      output: `
        <template>
          <CustomList>
            <li slot-scope="a, b">{{ a }}</li>
          </CustomList>
        </template>`,
      errors: [
        {
          message: "There should be no space before ','.",
          line: 4,
          column: 31,
          endLine: 4,
          endColumn: 32
        },
        {
          message: "A space is required after ','.",
          line: 4,
          column: 31,
          endLine: 4,
          endColumn: 32
        }
      ]
    },
    {
      code: `
        <template>
          {{ [a /*comment*/ ,/*comment*/b] }}
        </template>`,
      output: `
        <template>
          {{ [a /*comment*/, /*comment*/b] }}
        </template>`,
      errors: [
        {
          message: "There should be no space before ','.",
          line: 3,
          column: 29,
          endLine: 3,
          endColumn: 30
        },
        {
          message: "A space is required after ','.",
          line: 3,
          column: 29,
          endLine: 3,
          endColumn: 30
        }
      ]
    },
    {
      code: `
        <template>
          <button @click="
            fn(a, b)
          "/>
        </template>`,
      output: `
        <template>
          <button @click="
            fn(a ,b)
          "/>
        </template>`,
      options: [{ before: true, after: false }],
      errors: [
        {
          message: "A space is required before ','.",
          line: 4,
          column: 17,
          endLine: 4,
          endColumn: 18
        },
        {
          message: "There should be no space after ','.",
          line: 4,
          column: 17,
          endLine: 4,
          endColumn: 18
        }
      ]
    },
    {
      code: `
      <style>
      .text {
        color: v-bind('foo(a,b)')
      }
      </style>`,
      output: `
      <style>
      .text {
        color: v-bind('foo(a, b)')
      }
      </style>`,
      errors: [
        {
          message: "A space is required after ','.",
          line: 4,
          column: 29,
          endLine: 4,
          endColumn: 30
        }
      ]
    }
  ]
})
