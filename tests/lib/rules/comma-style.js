/**
 * @author Yosuke Ota
 */
'use strict'

const { RuleTester } = require('../../eslint-compat')
const rule = require('../../../lib/rules/comma-style')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2018 }
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
    `
      <template>
        <CustomButton v-slot="a,
          b
          ,c" />
      </template>
    `,
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
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 14
        }
      ]
    },
    {
      code: `
        <template>
          <CustomButton @click="($event
            , data) => fn()" />
        </template>`,
      output: `
        <template>
          <CustomButton @click="($event,
             data) => fn()" />
        </template>`,
      options: ['last', { exceptions: { ArrowFunctionExpression: false } }],
      errors: [
        {
          message: "',' should be placed last.",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 14
        }
      ]
    },
    {
      code: `
        <template>
          <CustomButton @click="($event,
            data) => fn()" />
        </template>`,
      output: `
        <template>
          <CustomButton @click="($event
            ,data) => fn()" />
        </template>`,
      options: ['first', { exceptions: { ArrowFunctionExpression: false } }],
      errors: [
        {
          message: "',' should be placed first.",
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
          <CustomButton v-slot="foo,
            bar" >
            <div/>
          </CustomButton>
        </template>`,
      output: `
        <template>
          <CustomButton v-slot="foo
            ,bar" >
            <div/>
          </CustomButton>
        </template>`,
      options: ['first', { exceptions: { FunctionExpression: false } }],
      errors: [
        {
          message: "',' should be placed first.",
          line: 3,
          column: 36,
          endLine: 3,
          endColumn: 37
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
      output: `
        <template>
          <CustomButton v-slot="a,
            b,
            c" />
        </template>`,
      options: ['last', { exceptions: { FunctionExpression: false } }],
      errors: [
        {
          message: "',' should be placed last.",
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 14
        }
      ]
    }
  ]
})
