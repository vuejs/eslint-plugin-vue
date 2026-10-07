/**
 * @author Yosuke Ota
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/block-lang'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2015
  }
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
    `
      <template></template>
      <script></script>
      <style></style>
    `,
    // `allowNoBlock` defaults to `true`, so a missing block is not reported.
    {
      code: '<template><div /></template>',
      options: [{ script: { lang: 'ts' } }]
    },
    {
      code: '<template><div /></template>',
      options: [{ script: { lang: 'ts', allowNoBlock: true } }]
    },
    '<template><div /></template>',
    {
      code: `<template></template>
      <script lang="ts"></script>`,
      options: [{ script: { lang: 'ts', allowNoBlock: false } }]
    },
    {
      code: `<template></template>
      <script setup lang="ts"></script>`,
      options: [{ script: { lang: 'ts', allowNoBlock: false } }]
    },
    // A block with no `lang` satisfies `allowNoBlock` on its own.
    {
      code: `<template></template>
      <script></script>`,
      options: [{ script: { allowNoBlock: false } }]
    },
    {
      code: `<template></template>
      <script></script>`,
      options: [{ script: { lang: 'js', allowNoBlock: false } }]
    },
    // Several blocks of the same name.
    {
      code: `<i18n lang="json"></i18n>
      <i18n lang="json"></i18n>
      <template></template>`,
      options: [{ i18n: { lang: 'json', allowNoBlock: false } }]
    },
    {
      code: `<template></template>
      <script lang="ts"></script>
      <style lang="scss"></style>`,
      options: [
        {
          template: { allowNoBlock: false },
          script: { lang: 'ts', allowNoBlock: false },
          style: { lang: 'scss', allowNoBlock: false }
        }
      ]
    },
    // Not an SFC, so there are no blocks to require.
    {
      filename: 'test.js',
      code: 'var a = 1',
      options: [{ script: { lang: 'ts', allowNoBlock: false } }]
    }
  ],
  invalid: [
    {
      code: `<template></template>
      <script lang="js"></script>`,
      options: [{ script: { lang: 'ts' } }],
      errors: [
        {
          message:
            "Only 'ts' can be used for the 'lang' attribute of '<script>'.",
          line: 2,
          column: 15,
          endLine: 2,
          endColumn: 24
        }
      ]
    },
    {
      code: `<template></template>
      <script lang="js"></script>`,
      options: [{ script: { lang: ['ts'] } }],
      errors: [
        {
          message:
            "Only 'ts' can be used for the 'lang' attribute of '<script>'.",
          line: 2,
          column: 15,
          endLine: 2,
          endColumn: 24
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
          column: 7,
          endLine: 2,
          endColumn: 15
        }
      ]
    },
    {
      code: `<template></template>
      <script lang=""></script>`,
      options: [{ script: { lang: 'ts' } }],
      errors: [
        {
          message:
            "Only 'ts' can be used for the 'lang' attribute of '<script>'.",
          line: 2,
          column: 15,
          endLine: 2,
          endColumn: 22
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
          column: 30,
          endLine: 1,
          endColumn: 39
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
          column: 30,
          endLine: 1,
          endColumn: 39
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
          column: 30,
          endLine: 1,
          endColumn: 39
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
          column: 1,
          endLine: 1,
          endColumn: 7
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
            "Only 'json' can be used for the 'lang' attribute of '<i18n>'. Or, not specifying the 'lang' attribute is allowed.",
          line: 2,
          column: 13,
          endLine: 2,
          endColumn: 24
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
            "Only 'json', and 'yaml' can be used for the 'lang' attribute of '<i18n>'. Or, not specifying the 'lang' attribute is allowed.",
          line: 2,
          column: 13,
          endLine: 2,
          endColumn: 24
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
          column: 11,
          endLine: 1,
          endColumn: 21
        },
        {
          message: "Do not specify the 'lang' attribute of '<script>'.",
          line: 2,
          column: 15,
          endLine: 2,
          endColumn: 24
        },
        {
          message: "Do not specify the 'lang' attribute of '<style>'.",
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 27
        }
      ]
    },
    // https://github.com/vuejs/eslint-plugin-vue/issues/2720
    {
      code: '<template><div /></template>',
      options: [{ script: { lang: 'ts', allowNoBlock: false } }],
      errors: [
        {
          message: "The '<script>' block is missing.",
          line: 1,
          column: 1,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '',
      options: [{ script: { lang: 'ts', allowNoBlock: false } }],
      errors: [
        {
          message: "The '<script>' block is missing.",
          line: 1,
          column: 1,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    // Requiring a block without restricting its `lang`.
    {
      code: '<template><div /></template>',
      options: [{ script: { allowNoBlock: false } }],
      errors: [
        {
          message: "The '<script>' block is missing.",
          line: 1,
          column: 1,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: `<script lang="ts"></script>`,
      options: [{ template: { allowNoBlock: false } }],
      errors: [
        {
          message: "The '<template>' block is missing.",
          line: 1,
          column: 1,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    // A custom block can be required too.
    {
      code: `<template></template>
      <script lang="ts"></script>`,
      options: [{ i18n: { lang: 'json', allowNoBlock: false } }],
      errors: [
        {
          message: "The '<i18n>' block is missing.",
          line: 1,
          column: 1,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    // Several missing blocks are reported separately.
    {
      code: '<template><div /></template>',
      options: [
        {
          script: { lang: 'ts', allowNoBlock: false },
          style: { lang: 'scss', allowNoBlock: false }
        }
      ],
      errors: [
        {
          message: "The '<script>' block is missing.",
          line: 1,
          column: 1,
          endLine: undefined,
          endColumn: undefined
        },
        {
          message: "The '<style>' block is missing.",
          line: 1,
          column: 1,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    // A present block is still checked for its `lang`, not reported as missing.
    {
      code: `<template></template>
      <script></script>`,
      options: [{ script: { lang: 'ts', allowNoBlock: false } }],
      errors: [
        {
          message: "The 'lang' attribute of '<script>' is missing.",
          line: 2,
          column: 7,
          endLine: 2,
          endColumn: 15
        }
      ]
    },
    {
      code: `<template></template>
      <script setup></script>`,
      options: [{ script: { lang: 'ts', allowNoBlock: false } }],
      errors: [
        {
          message: "The 'lang' attribute of '<script>' is missing.",
          line: 2,
          column: 7,
          endLine: 2,
          endColumn: 21
        }
      ]
    },
    // A missing block and a wrong `lang` on another block.
    {
      code: `<template lang="pug"></template>`,
      options: [
        {
          template: { lang: 'pug', allowNoBlock: false },
          script: { lang: 'ts', allowNoBlock: false }
        }
      ],
      errors: [
        {
          message: "The '<script>' block is missing.",
          line: 1,
          column: 1,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    }
  ]
})
