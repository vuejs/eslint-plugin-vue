/**
 * @author Yosuke Ota
 */
'use strict'

const { RuleTester } = require('eslint')
const rule = require('../../../lib/rules/comma-style')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2018 }
})

tester.run('comma-style', rule, {
  valid: [
    `<template>
      <CustomButton @click="() => fn({
        a,
        b
      })" />
    </template>`,
    {
      code: `
        <template>
          <CustomButton @click="($event,
            data) => fn()" />
        </template>`,
      options: ['last', { exceptions: { ArrowFunctionExpression: false } }]
    },
    {
      code: `
        <template>
          <CustomButton @click="($event
            , data) => fn()" />
        </template>`,
      options: ['first', { exceptions: { ArrowFunctionExpression: false } }]
    },
    {
      code: `
        <template>
          <CustomButton v-slot="a,
            b
            ,c" />
        </template>`
    },
    {
      code: `
        <template>
          <CustomButton v-slot="a,
            b
            ,c" />
        </template>`,
      options: ['first', { exceptions: { FunctionExpression: true } }]
    }
  ],
  invalid: [
    {
      code: `
        <template>
          <CustomButton @click="() => fn({
            a
            , b
          })" />
        </template>`,
      output: `
        <template>
          <CustomButton @click="() => fn({
            a,
             b
          })" />
        </template>`,
      errors: [
        {
          message: "',' should be placed last.",
          line: 5
        }
      ]
    },
    {
      code: `
        <template>
          <CustomButton @click="($event
            , data) => fn()" />
        </template>`,
      options: ['last', { exceptions: { ArrowFunctionExpression: false } }],
      output: `
        <template>
          <CustomButton @click="($event,
             data) => fn()" />
        </template>`,
      errors: [
        {
          message: "',' should be placed last.",
          line: 4
        }
      ]
    },
    {
      code: `
        <template>
          <CustomButton @click="($event,
            data) => fn()" />
        </template>`,
      options: ['first', { exceptions: { ArrowFunctionExpression: false } }],
      output: `
        <template>
          <CustomButton @click="($event
            ,data) => fn()" />
        </template>`,
      errors: [
        {
          message: "',' should be placed first."
          // line: 3 // eslint v7.0
        }
      ]
    },
    {
      code: `
        <template>
          <CustomButton v-slot="foo,
            bar" >
            <div/>
          </CustomButton>
        </template>`,
      options: ['first', { exceptions: { FunctionExpression: false } }],
      output: `
        <template>
          <CustomButton v-slot="foo
            ,bar" >
            <div/>
          </CustomButton>
        </template>`,
      errors: [
        {
          message: "',' should be placed first."
          // line: 3 // eslint v7.0
        }
      ]
    },
    {
      code: `
        <template>
          <CustomButton v-slot="a,
            b
            ,c" />
        </template>`,
      options: ['last', { exceptions: { FunctionExpression: false } }],
      output: `
        <template>
          <CustomButton v-slot="a,
            b,
            c" />
        </template>`,
      errors: [
        {
          message: "',' should be placed last."
          // line: 3 // eslint v7.0
        }
      ]
    }
  ]
})
