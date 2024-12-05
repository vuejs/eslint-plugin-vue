/**
 * @author lozinsky <https://github.com/lozinsky>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-implicit-coercion')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-implicit-coercion', rule, {
  valid: [
    `<template><div :data-foo="Boolean(foo)" /></template>`,
    `<template><div :data-foo="foo.indexOf('.') !== -1" /></template>`,
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="!!foo" /></template>`,
      options: [
        {
          boolean: false
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="~foo.indexOf('.')" /></template>`,
      options: [
        {
          boolean: false
        }
      ]
    },
    `<template><div :data-foo="Number(foo)" /></template>`,
    `<template><div :data-foo="foo * 1/4" /></template>`,
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="+foo" /></template>`,
      options: [
        {
          number: false
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="1 * foo" /></template>`,
      options: [
        {
          number: false
        }
      ]
    },
    `<template><div :data-foo="String(foo)" /></template>`,
    `<template><div :data-foo="\`\${foo}\`" /></template>`,
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="'' + foo" /></template>`,
      options: [
        {
          string: false
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="\`\` + foo" /></template>`,
      options: [
        {
          string: false
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="!!foo" /></template>`,
      options: [
        {
          allow: ['!!']
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="~foo.indexOf('.')" /></template>`,
      options: [
        {
          allow: ['~']
        }
      ]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="!!foo" /></template>`,
      output: `<template><div :data-foo="Boolean(foo)" /></template>`,
      errors: [
        {
          message: 'use `Boolean(foo)` instead.',
          line: 1,
          column: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="~foo.indexOf('.')" /></template>`,
      output: null,
      errors: [
        {
          message: "use `foo.indexOf('.') !== -1` instead.",
          line: 1,
          column: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="+foo" /></template>`,
      output: `<template><div :data-foo="Number(foo)" /></template>`,
      errors: [
        {
          message: 'use `Number(foo)` instead.',
          line: 1,
          column: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="1 * foo" /></template>`,
      output: `<template><div :data-foo="Number(foo)" /></template>`,
      errors: [
        {
          message: 'use `Number(foo)` instead.',
          line: 1,
          column: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="'' + foo" /></template>`,
      output: `<template><div :data-foo="String(foo)" /></template>`,
      errors: [
        {
          message: 'use `String(foo)` instead.',
          line: 1,
          column: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="\`\` + foo" /></template>`,
      output: `<template><div :data-foo="String(foo)" /></template>`,
      errors: [
        {
          message: 'use `String(foo)` instead.',
          line: 1,
          column: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="\`\${foo}\`" /></template>`,
      output: `<template><div :data-foo="String(foo)" /></template>`,
      options: [
        {
          disallowTemplateShorthand: true
        }
      ],
      errors: [
        {
          message: 'use `String(foo)` instead.',
          line: 1,
          column: 27
        }
      ]
    }
  ]
})
