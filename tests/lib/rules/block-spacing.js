/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/block-spacing')

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
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
          line: 3
        },
        {
          messageId: 'missing',
          data: {
            location: 'before',
            token: '}'
          },
          // message: 'Requires a space before \'}\'',
          line: 3
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
          line: 3
        },
        {
          messageId: 'missing',
          data: {
            location: 'before',
            token: '}'
          },
          // message: 'Requires a space before \'}\'',
          line: 3
        }
      ]
    },
    {
      code: `
        <template>
          <div :attr="function foo() { return true; }" />
        </template>`,
      options: ['never'],
      output: `
        <template>
          <div :attr="function foo() {return true;}" />
        </template>`,
      errors: [
        {
          messageId: 'extra',
          data: {
            location: 'after',
            token: '{'
          },
          // message: 'Unexpected space(s) after \'{\'',
          line: 3
        },
        {
          messageId: 'extra',
          data: {
            location: 'before',
            token: '}'
          },
          // message: 'Unexpected space(s) before \'}\'',
          line: 3
        }
      ]
    },
    {
      code: '<template><div :[(function(){return(1)})()]="(function(){return(1)})()" /></template>',
      output: '<template><div :[(function(){return(1)})()]="(function(){ return(1) })()" /></template>',
      errors: [
        {
          messageId: 'missing',
          data: {
            location: 'after',
            token: '{'
          }
          // message: 'Requires a space after \'{\'',
        },
        {
          messageId: 'missing',
          data: {
            location: 'before',
            token: '}'
          }
          // message: 'Requires a space before \'}\'',
        }]
    }
  ]
})
