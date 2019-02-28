/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/brace-style')

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('brace-style', rule, {
  valid: [
    `<template><div :attr="function foo() {
      return true;
    }" /></template>`,
    {
      code: `<template><div :attr="function foo() { return true; }" /></template>`,
      options: ['1tbs', { 'allowSingleLine': true }]
    },
    `<template><div :[(function(){return(1)})()]="a" /></template>`
  ],
  invalid: [
    {
      code: `
        <template>
          <div :attr="function foo()
          {
            return true;
          }" />
        </template>`,
      output: `
        <template>
          <div :attr="function foo() {
            return true;
          }" />
        </template>`,
      errors: [
        {
          message: 'Opening curly brace does not appear on the same line as controlling statement.',
          line: 4
        }
      ]
    },
    {
      code: `
        <template>
          <div :attr="function foo() { return true; }" />
        </template>`,
      output: `
        <template>
          <div :attr="function foo() {
 return true;\u{20}
}" />
        </template>`,
      errors: [
        {
          message: 'Statement inside of curly braces should be on next line.',
          line: 3
        },
        {
          message: 'Closing curly brace should be on the same line as opening curly brace or on the line after the previous block.',
          line: 3
        }
      ]
    },
    {
      code: '<template><div :[(function(){return(1)})()]="(function(){return(1)})()" /></template>',
      output: `<template><div :[(function(){return(1)})()]="(function(){
return(1)
})()" /></template>`,
      errors: [
        {
          message: 'Statement inside of curly braces should be on next line.'
        },
        {
          message: 'Closing curly brace should be on the same line as opening curly brace or on the line after the previous block.'
        }]
    }
  ]
})
