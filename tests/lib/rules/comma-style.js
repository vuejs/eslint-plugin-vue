/**
 * @author Yosuke Ota
 */
'use strict'

const semver = require('semver')
const { RuleTester } = require('../../eslint-compat')
const rule = require('../../../lib/rules/comma-style')
const { eslintStylisticVersion } = require('../../test-utils/eslint-stylistic')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2018 }
})

const isOldStylistic =
  eslintStylisticVersion === undefined ||
  semver.lt(eslintStylisticVersion, '3.0.0') ||
  semver.satisfies(process.version, '<19.0.0 || ^21.0.0')

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
    ...(isOldStylistic
      ? [
          `
      <template>
        <CustomButton v-slot="a,
          b
          ,c" />
      </template>
    `
        ]
      : []),
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
    ...(isOldStylistic
      ? []
      : [
          {
            code: `
        <template>
          <CustomButton v-slot="a,
            b
            ,c" />
        </template>
      `,
            output: `
        <template>
          <CustomButton v-slot="a,
            b,
            c" />
        </template>
      `,
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
        ]),
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
