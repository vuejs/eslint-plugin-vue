/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/comma-spacing')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020 }
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
    `fn = (a,b) => {}`
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
          column: 25
        },
        {
          message: "A space is required after ','.",
          line: 4,
          column: 25
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
          line: 3
        },
        {
          message: "A space is required after ','.",
          line: 3
        },
        {
          message: "There should be no space before ','.",
          line: 3
        },
        {
          message: "A space is required after ','.",
          line: 3
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
          line: 3
        },
        {
          message: "A space is required after ','.",
          line: 3
        },
        {
          message: "There should be no space before ','.",
          line: 3
        },
        {
          message: "A space is required after ','.",
          line: 3
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
          line: 3
        },
        {
          message: "A space is required after ','.",
          line: 3
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
          line: 3
        },
        {
          message: "A space is required after ','.",
          line: 3
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
          line: 3
        },
        {
          message: "A space is required after ','.",
          line: 3
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
          line: 4
        },
        {
          message: "A space is required after ','.",
          line: 4
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
          line: 3
        },
        {
          message: "A space is required after ','.",
          line: 3
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
      options: [{ before: true, after: false }],
      output: `
        <template>
          <button @click="
            fn(a ,b)
          "/>
        </template>`,
      errors: [
        {
          message: "A space is required before ','.",
          line: 4
        },
        {
          message: "There should be no space after ','.",
          line: 4
        }
      ]
    }
  ]
})
