/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/padding-line-between-blocks')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020 }
})

tester.run('padding-line-between-blocks', rule, {
  valid: [
    `
    <template></template>

    <script></script>

    <style></style>
    `,
    `<template></template>

    <script></script>

    <style></style>`,
    {
      code: `
      <template></template>
      <script></script>
      <style></style>
      `,
      options: ['never']
    },
    // comments
    `
    <template></template>

    <!-- comment -->
    <script></script>
    <!-- comment -->

    <style></style>
    <!-- comment -->

    <!-- comment -->
    <i18n></i18n>
    `,
    {
      code: `
      <template></template>
      <!-- comment -->
      <script></script>
      <!-- comment -->
      <!-- comment -->
      <style></style>
      `,
      options: ['never']
    },
    // same line
    {
      code: `<template></template><script></script><style></style>`,
      options: ['never']
    },
    {
      code: `<template>

      </template><script>

      </script>`,
      options: ['never']
    },
    // no template
    `
    <script></script>

    <style></style>
    `,
    {
      code: `
      <script></script>
      <style></style>
      `,
      options: ['never']
    },
    `var a = 1`
  ],
  invalid: [
    {
      code: `
      <template></template>
      <script></script>
      <style></style>
      `,
      output: `
      <template></template>

      <script></script>

      <style></style>
      `,
      errors: [
        {
          message: 'Expected blank line before this block.',
          line: 3,
          column: 7,
          endLine: 3,
          endColumn: 24
        },
        {
          message: 'Expected blank line before this block.',
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 22
        }
      ]
    },
    {
      code: `
      <template></template>

      <script></script>

      <style></style>
      `,
      options: ['never'],
      output: `
      <template></template>
      <script></script>
      <style></style>
      `,
      errors: [
        {
          message: 'Unexpected blank line before this block.',
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 24
        },
        {
          message: 'Unexpected blank line before this block.',
          line: 6,
          column: 7,
          endLine: 6,
          endColumn: 22
        }
      ]
    },
    {
      code: `
      <template></template><script></script><style></style>
      `,
      output: `
      <template></template>

<script></script>

<style></style>
      `,
      errors: [
        {
          message: 'Expected blank line before this block.',
          line: 2
        },
        {
          message: 'Expected blank line before this block.',
          line: 2
        }
      ]
    },
    {
      code: `
      <template></template>
      <!-- comment -->
      <script></script>
      <!-- comment -->
      <!-- comment -->
      <style></style>
      `,
      output: `
      <template></template>

      <!-- comment -->
      <script></script>

      <!-- comment -->
      <!-- comment -->
      <style></style>
      `,
      errors: [
        {
          message: 'Expected blank line before this block.',
          line: 4
        },
        {
          message: 'Expected blank line before this block.',
          line: 7
        }
      ]
    },
    {
      code: `
      <template></template>

      <!-- comment -->
      <script></script>
      <!-- comment -->

      <style></style>
      <!-- comment -->

      <!-- comment -->
      <i18n></i18n>
      `,
      options: ['never'],
      output: `
      <template></template>
      <!-- comment -->
      <script></script>
      <!-- comment -->
      <style></style>
      <!-- comment -->
      <!-- comment -->
      <i18n></i18n>
      `,
      errors: [
        {
          message: 'Unexpected blank line before this block.',
          line: 5
        },
        {
          message: 'Unexpected blank line before this block.',
          line: 8
        },
        {
          message: 'Unexpected blank line before this block.',
          line: 12
        }
      ]
    },
    {
      code: `
      <template></template>TEXT
      <!-- comment --><script></script><!-- comment
      comment --><style></style>
      `,
      output: `
      <template></template>TEXT

      <!-- comment --><script></script>

<!-- comment
      comment --><style></style>
      `,
      errors: [
        {
          message: 'Expected blank line before this block.',
          line: 3
        },
        {
          message: 'Expected blank line before this block.',
          line: 4
        }
      ]
    },
    {
      code: `
      <script></script>


      <!-- comment -->

      TEXT TEXT

      <!-- comment


      comment -->

      <!-- comment -->


      TEXT



      TEXT

      <style></style>
      `,
      options: ['never'],
      output: `
      <script></script>
      <!-- comment -->
      TEXT TEXT
      <!-- comment


      comment -->
      <!-- comment -->
      TEXT
      TEXT
      <style></style>
      `,
      errors: [
        {
          message: 'Unexpected blank line before this block.',
          line: 23
        }
      ]
    }
  ]
})
