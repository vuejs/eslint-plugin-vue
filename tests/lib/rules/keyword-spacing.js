/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/keyword-spacing')

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
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
      code:
      `<template>
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
      code:
      `<template>
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
      output:
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
      errors: [
        {
          message: 'Expected space(s) after "if".',
          line: 3
        },
        {
          message: 'Expected space(s) before "else".',
          line: 5
        },
        {
          message: 'Expected space(s) after "if".',
          line: 5
        },
        {
          message: 'Expected space(s) before "else".',
          line: 7
        },
        {
          message: 'Expected space(s) after "else".',
          line: 7
        }
      ]
    },
    {
      code:
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
      options: [{ before: false, after: false }],
      output:
      `<template>
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
      errors: [
        {
          message: 'Unexpected space(s) after "if".',
          line: 3
        },
        {
          message: 'Unexpected space(s) before "else".',
          line: 5
        },
        {
          message: 'Unexpected space(s) after "if".',
          line: 5
        },
        {
          message: 'Unexpected space(s) before "else".',
          line: 7
        },
        {
          message: 'Unexpected space(s) after "else".',
          line: 7
        }
      ]
    },
    {
      code:
      `<template>
        <div :[(function(){return(1)})()]="(function(){return(1)})()" />
      </template>`,
      output:
      `<template>
        <div :[(function(){return(1)})()]="(function(){return (1)})()" />
      </template>`,
      errors: [
        {
          message: 'Expected space(s) after "return".',
          line: 2
        }]
    }
  ]
})
