/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/keyword-spacing')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('keyword-spacing', rule, {
  valid: [
    `<template>
      <div @event="
        if (foo) {
          //...
        } else if (bar) {
          //...
        } else {
          //...
        }
      " />
    </template>`,
    {
      code: `<template>
        <div @event="
          if(foo) {
            //...
          }else if(bar) {
            //...
          }else{
            //...
          }
        " />
      </template>`,
      options: [{ before: false, after: false }]
    },
    `<template>
      <div :[(function(){return(1)})()]="val" />
    </template>`
  ],
  invalid: [
    {
      code: `<template>
        <div @event="
          if(foo) {
            //...
          }else if(bar) {
            //...
          }else{
            //...
          }
        " />
      </template>`,
      output: `<template>
        <div @event="
          if (foo) {
            //...
          } else if (bar) {
            //...
          } else {
            //...
          }
        " />
      </template>`,
      errors: [
        {
          message: 'Expected space(s) after "if".',
          line: 3,
          column: 11,
          endLine: 3,
          endColumn: 13
        },
        {
          message: 'Expected space(s) before "else".',
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 16
        },
        {
          message: 'Expected space(s) after "if".',
          line: 5,
          column: 17,
          endLine: 5,
          endColumn: 19
        },
        {
          message: 'Expected space(s) before "else".',
          line: 7,
          column: 12,
          endLine: 7,
          endColumn: 16
        },
        {
          message: 'Expected space(s) after "else".',
          line: 7,
          column: 12,
          endLine: 7,
          endColumn: 16
        }
      ]
    },
    {
      code: `<template>
        <div @event="
          if (foo) {
            //...
          } else if (bar) {
            //...
          } else {
            //...
          }
        " />
      </template>`,
      output: `<template>
        <div @event="
          if(foo) {
            //...
          }else if(bar) {
            //...
          }else{
            //...
          }
        " />
      </template>`,
      options: [{ before: false, after: false }],
      errors: [
        {
          message: 'Unexpected space(s) after "if".',
          line: 3,
          column: 13,
          endLine: 3,
          endColumn: 14
        },
        {
          message: 'Unexpected space(s) before "else".',
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 13
        },
        {
          message: 'Unexpected space(s) after "if".',
          line: 5,
          column: 20,
          endLine: 5,
          endColumn: 21
        },
        {
          message: 'Unexpected space(s) before "else".',
          line: 7,
          column: 12,
          endLine: 7,
          endColumn: 13
        },
        {
          message: 'Unexpected space(s) after "else".',
          line: 7,
          column: 17,
          endLine: 7,
          endColumn: 18
        }
      ]
    },
    {
      code: `<template>
        <div :[(function(){return(1)})()]="(function(){return(1)})()" />
      </template>`,
      output: `<template>
        <div :[(function(){return(1)})()]="(function(){return (1)})()" />
      </template>`,
      errors: [
        {
          message: 'Expected space(s) after "return".',
          line: 2,
          column: 56,
          endLine: 2,
          endColumn: 62
        }
      ]
    }
  ]
})
