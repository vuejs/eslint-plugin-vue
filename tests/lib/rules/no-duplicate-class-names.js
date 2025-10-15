/**
 * @author Yizack Rangel
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-duplicate-class-names')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-duplicate-class-names', rule, {
  valid: [
    {
      filename: 'no-classes.vue',
      code: '<template><div></div></template>'
    },
    {
      filename: 'one-class.vue',
      code: '<template><div class="foo"></div></template>'
    },
    {
      filename: 'multiple-different-classes.vue',
      code: '<template><div class="foo bar baz"></div></template>'
    },
    {
      filename: 'no-duplicate-class-in-directive-string.vue',
      code: `<template><div :class="'foo bar baz'"></div></template>`
    },
    {
      filename: 'no-duplicate-class-in-directive-literal.vue',
      code: '<template><div :class="`foo bar baz`"></div></template>'
    },
    {
      filename: 'no-duplicate-class-in-directive-object.vue',
      code: `<template><div :class="{ 'foo bar baz': true }"></div></template>`
    },
    {
      filename: 'duplicate-class-in-different-directive-object-keys.vue',
      code: `<template><div :class="{ 'foo': true, 'foo bar': true }"></div></template>`
    },
    {
      filename: 'class-conditional-expression.vue',
      code: `<template><div :class="isActive ? 'foo' : 'bar'"></div></template>`
    },
    {
      filename: 'class-conditional-duplicate-expression-value.vue',
      code: `<template><div :class="isActive ? 'foo' : 'foo'"></div></template>`
    },
    {
      filename: 'class-object-duplicate-value.vue',
      code: `<div :class="{ 'foo bar': isActive, 'foo': isAnotherActive }"></div>`
    }
  ],
  invalid: [
    {
      filename: 'duplicate-class.vue',
      code: '<template><div class="foo foo"></div></template>',
      output: '<template><div class="foo"></div></template>',
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'VLiteral'
        }
      ]
    },
    {
      filename: 'multiple-duplicate-classes.vue',
      code: '<template><div class="foo bar foo baz bar"></div></template>',
      output: '<template><div class="foo bar baz"></div></template>',
      errors: [
        {
          message: "Duplicate class names 'foo', 'bar'.",
          type: 'VLiteral'
        }
      ]
    },
    {
      filename: 'duplicate-class-in-directive-string.vue',
      code: `<template><div :class="'foo foo'"></div></template>`,
      output: `<template><div :class="'foo'"></div></template>`,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'Literal'
        }
      ]
    },
    {
      filename: 'duplicate-class-in-directive-literal.vue',
      code: '<template><div :class="`foo foo`"></div></template>',
      output: '<template><div :class="`foo`"></div></template>',
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'TemplateElement'
        }
      ]
    },
    {
      filename: 'duplicate-class-directive-object-key.vue',
      code: `<template><div :class="{ 'foo foo': true }"></div></template>`,
      output: `<template><div :class="{ 'foo': true }"></div></template>`,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'Literal'
        }
      ]
    },
    {
      filename: 'multiple-duplicate-class-directive-object-keys.vue',
      code: `<template><div :class="{ 'foo foo bar': true, 'bar bar baz': true }"></div></template>`,
      output: `<template><div :class="{ 'foo bar': true, 'bar baz': true }"></div></template>`,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'Literal'
        },
        {
          message: "Duplicate class names 'bar'.",
          type: 'Literal'
        }
      ]
    },
    {
      filename: 'duplicate-class-directive-array-item.vue',
      code: `<template><div :class="['foo foo']"></div></template>`,
      output: `<template><div :class="['foo']"></div></template>`,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'Literal'
        }
      ]
    },
    {
      filename: 'multiple-duplicate-classes-directive-array-items.vue',
      code: `<template><div :class="['foo foo', 'bar bar baz']"></div></template>`,
      output: `<template><div :class="['foo', 'bar baz']"></div></template>`,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'Literal'
        },
        {
          message: "Duplicate class names 'bar'.",
          type: 'Literal'
        }
      ]
    },
    {
      filename: 'duplicate-class-in-mixed-directive.vue',
      code: `<template><div :class="['foo foo', { 'bar bar baz': true }]"></div></template>`,
      output: `<template><div :class="['foo', { 'bar baz': true }]"></div></template>`,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'Literal'
        },
        {
          message: "Duplicate class names 'bar'.",
          type: 'Literal'
        }
      ]
    },
    {
      filename: 'duplicate-class-conditional-expression.vue',
      code: `<template><div :class="isActive ? 'foo foo' : 'bar'"></div></template>`,
      output: `<template><div :class="isActive ? 'foo' : 'bar'"></div></template>`,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'Literal'
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-expression.vue',
      code: `<template><div :class="'foo foo ' + ' bar'"></div></template>`,
      output: `<template><div :class="'foo ' + ' bar'"></div></template>`,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'Literal'
        }
      ]
    },
    {
      filename: 'duplicate-class-preserved-spaces-1.vue',
      code: `<template><div class="foo foo     bar"></div></template>`,
      output: `<template><div class="foo     bar"></div></template>`,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'VLiteral'
        }
      ]
    },
    {
      filename: 'duplicate-class-preserved-spaces-2.vue',
      code: `<template><div class="foo bar    baz foo"></div></template>`,
      output: `<template><div class="foo bar    baz"></div></template>`,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'VLiteral'
        }
      ]
    },
    {
      filename: 'duplicate-class-preserved-spaces-3.vue',
      code: `<template><div class="foo bar foo     baz"></div></template>`,
      output: `<template><div class="foo bar     baz"></div></template>`,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'VLiteral'
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-attribute-string.vue',
      code: `<template><div class="foo" :class="'foo'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'VStartTag'
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-attribute-literal.vue',
      code: '<template><div class="foo" :class="`foo`"></div></template>',
      output: null,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'VStartTag'
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-attribute.vue',
      code: `<template><div class="foo" :class="'foo bar'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'VStartTag'
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-attribute-multiple-duplicates.vue',
      code: `<template><div class="foo bar" :class="'foo bar'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class names 'foo', 'bar'.",
          type: 'VStartTag'
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-attribute-array.vue',
      code: `<template><div class="foo" :class="['foo', 'bar']"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'VStartTag'
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-attribute-object.vue',
      code: `<template><div class="foo" :class="{ 'foo': true }"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'VStartTag'
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-attribute-mixed.vue',
      code: `<template><div class="foo" :class="['foo', { 'bar': true }]"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'VStartTag'
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-attribute-binary.vue',
      code: `<template><div class="foo" :class="'foo ' + 'bar'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'VStartTag'
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-attribute-conditional.vue',
      code: `<template><div class="foo" :class="isActive ? 'foo' : 'bar'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'VStartTag'
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-node-array.vue',
      code: `<template><div :class="['foo', 'foo']"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'ArrayExpression'
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-node-binary.vue',
      code: `<template><div :class="'foo ' + 'foo'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'BinaryExpression'
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-node-mixed.vue',
      code: `<template><div :class="['foo', { 'foo': true }]"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class names 'foo'.",
          type: 'ArrayExpression'
        }
      ]
    }
  ]
})
