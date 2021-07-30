/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/block-lang')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('block-lang', rule, {
  valid: [
    {
      code: `<template></template>
      <script lang="ts"></script>`,
      options: [{ script: { lang: 'ts' } }]
    },
    {
      code: `<template></template>
      <script></script>`,
      options: [{ script: { lang: 'js' } }]
    },
    {
      code: '<i18n></i18n><i18n lang="json"></i18n>',
      options: [{ i18n: { lang: 'json', allowNoLang: true } }]
    },
    {
      code: `<template></template>
      <script></script>
      <style></style>`
    }
  ],
  invalid: [
    {
      code: `<template></template>
      <script lang="js"></script>`,
      options: [{ script: { lang: 'ts' } }],
      errors: [
        {
          message: `Only "ts" can be used for the 'lang' attribute of '<script>'.`,
          line: 2,
          column: 15
        }
      ]
    },
    {
      code: `<template></template>
      <script lang="js"></script>`,
      options: [{ script: { lang: ['ts'] } }],
      errors: [
        {
          message: `Only "ts" can be used for the 'lang' attribute of '<script>'.`,
          line: 2,
          column: 15
        }
      ]
    },
    {
      code: `<template></template>
      <script></script>`,
      options: [{ script: { lang: 'ts' } }],
      errors: [
        {
          message: "The 'lang' attribute of '<script>' is missing.",
          line: 2,
          column: 7
        }
      ]
    },
    {
      code: `<template></template>
      <script lang=""></script>`,
      options: [{ script: { lang: 'ts' } }],
      errors: [
        {
          message: `Only "ts" can be used for the 'lang' attribute of '<script>'.`,
          line: 2,
          column: 15
        }
      ]
    },
    {
      code: '<template></template><script lang="ts"></script>',
      options: [{ script: { lang: 'js' } }],
      errors: [
        {
          message: "Do not specify the 'lang' attribute of '<script>'.",
          line: 1,
          column: 30
        }
      ]
    },
    {
      code: '<template></template><script lang="js"></script>',
      options: [{ script: { lang: 'js' } }],
      errors: [
        {
          message:
            "Do not explicitly specify the default language for the 'lang' attribute of '<script>'.",
          line: 1,
          column: 30
        }
      ]
    },
    {
      code: '<template></template><script lang="ts"></script>',
      options: [{ script: {} }],
      errors: [
        {
          message: "Do not specify the 'lang' attribute of '<script>'.",
          line: 1,
          column: 30
        }
      ]
    },
    {
      code: `<i18n></i18n>
      <i18n lang="json"></i18n>`,
      options: [{ i18n: { lang: 'json' } }],
      errors: [
        {
          message: "The 'lang' attribute of '<i18n>' is missing.",
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `<i18n></i18n>
      <i18n lang="yaml"></i18n>`,
      options: [{ i18n: { lang: 'json', allowNoLang: true } }],
      errors: [
        {
          message:
            "Only \"json\" can be used for the 'lang' attribute of '<i18n>'. Or, not specifying the `lang` attribute is allowed.",
          line: 2,
          column: 13
        }
      ]
    },
    {
      code: `<i18n></i18n>
      <i18n lang="toml"></i18n>`,
      options: [{ i18n: { lang: ['json', 'yaml'], allowNoLang: true } }],
      errors: [
        {
          message:
            'Only "json", and "yaml" can be used for the \'lang\' attribute of \'<i18n>\'. Or, not specifying the `lang` attribute is allowed.',
          line: 2,
          column: 13
        }
      ]
    },

    {
      code: `<template lang="pug"></template>
      <script lang="ts"></script>
      <style lang="stylus"></style>`,
      errors: [
        {
          message: "Do not specify the 'lang' attribute of '<template>'.",
          line: 1,
          column: 11
        },
        {
          message: "Do not specify the 'lang' attribute of '<script>'.",
          line: 2,
          column: 15
        },
        {
          message: "Do not specify the 'lang' attribute of '<style>'.",
          line: 3,
          column: 14
        }
      ]
    }
  ]
})
