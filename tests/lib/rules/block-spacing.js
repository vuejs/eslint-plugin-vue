/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/block-spacing')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('block-spacing', rule, {
  valid: [
    '<template><div :attr="function foo() { return true; }" /></template>',
    {
      code: '<template><div :attr="function foo() {return true;}" /></template>',
      options: ['never']
    },
    '<template><div :[(function(){return(1)})()]="a" /></template>'
  ],
  invalid: [
    {
      code: `
        <template>
          <div :attr="function foo() {return true;}" />
        </template>`,
      output: `
        <template>
          <div :attr="function foo() { return true; }" />
        </template>`,
      errors: [
        {
          messageId: 'missing',
          data: {
            location: 'after',
            token: '{'
          },
          // message: 'Requires a space after \'{\'',
          line: 3,
          column: 38,
          endLine: 3,
          endColumn: 39
        },
        {
          messageId: 'missing',
          data: {
            location: 'before',
            token: '}'
          },
          // message: 'Requires a space before \'}\'',
          line: 3,
          column: 51,
          endLine: 3,
          endColumn: 52
        }
      ]
    },
    {
      code: `
        <template>
          <button @click="() => {return true;}" />
        </template>`,
      output: `
        <template>
          <button @click="() => { return true; }" />
        </template>`,
      errors: [
        {
          messageId: 'missing',
          data: {
            location: 'after',
            token: '{'
          },
          // message: 'Requires a space after \'{\'',
          line: 3,
          column: 33,
          endLine: 3,
          endColumn: 34
        },
        {
          messageId: 'missing',
          data: {
            location: 'before',
            token: '}'
          },
          // message: 'Requires a space before \'}\'',
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
          <div :attr="function foo() { return true; }" />
        </template>`,
      output: `
        <template>
          <div :attr="function foo() {return true;}" />
        </template>`,
      options: ['never'],
      errors: [
        {
          messageId: 'extra',
          data: {
            location: 'after',
            token: '{'
          },
          // message: 'Unexpected space(s) after \'{\'',
          line: 3,
          column: 39,
          endLine: 3,
          endColumn: 40
        },
        {
          messageId: 'extra',
          data: {
            location: 'before',
            token: '}'
          },
          // message: 'Unexpected space(s) before \'}\'',
          line: 3,
          column: 52,
          endLine: 3,
          endColumn: 53
        }
      ]
    },
    {
      code: '<template><div :[(function(){return(1)})()]="(function(){return(1)})()" /></template>',
      output:
        '<template><div :[(function(){return(1)})()]="(function(){ return(1) })()" /></template>',
      errors: [
        {
          messageId: 'missing',
          data: {
            location: 'after',
            token: '{'
          },
          // message: 'Requires a space after \'{\'',
          line: 1,
          column: 57,
          endLine: 1,
          endColumn: 58
        },
        {
          messageId: 'missing',
          data: {
            location: 'before',
            token: '}'
          },
          // message: 'Requires a space before \'}\'',
          line: 1,
          column: 67,
          endLine: 1,
          endColumn: 68
        }
      ]
    }
  ]
})
