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
    },
    {
      filename: 'class-non-intersecting-conditions.vue',
      code: `<template><div :class="[isActive1 && { 'foo': isActive2, 'bar': isActive3 }, isActive4 && 'bar']"></div></template>`
    },
    {
      filename: 'class-multiple-logical-non-intersecting.vue',
      code: `<template><div :class="[isActive1 && 'foo', isActive2 && 'foo']"></div></template>`
    },
    {
      filename: 'class-binary-in-logical-non-intersecting.vue',
      code: `<template><div :class="[isActive1 && ('foo' + ' bar'), isActive2 && 'foo']"></div></template>`
    }
  ],
  invalid: [
    {
      filename: 'duplicate-class.vue',
      code: '<template><div class="foo foo"></div></template>',
      output: '<template><div class="foo"></div></template>',
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'VLiteral',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 31
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
          type: 'VLiteral',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 43
        }
      ]
    },
    {
      filename: 'duplicate-class-in-directive-string.vue',
      code: `<template><div :class="'foo foo'"></div></template>`,
      output: `<template><div :class="'foo'"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'Literal',
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 33
        }
      ]
    },
    {
      filename: 'duplicate-class-in-directive-literal.vue',
      code: '<template><div :class="`foo foo`"></div></template>',
      output: '<template><div :class="`foo`"></div></template>',
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'TemplateElement',
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 33
        }
      ]
    },
    {
      filename: 'duplicate-class-directive-object-key.vue',
      code: `<template><div :class="{ 'foo foo': true }"></div></template>`,
      output: `<template><div :class="{ 'foo': true }"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'Literal',
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'multiple-duplicate-class-directive-object-keys.vue',
      code: `<template><div :class="{ 'foo foo bar': true, 'bar bar baz': true }"></div></template>`,
      output: `<template><div :class="{ 'foo bar': true, 'bar baz': true }"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'Literal',
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 39
        },
        {
          message: "Duplicate class name 'bar'.",
          type: 'Literal',
          line: 1,
          column: 47,
          endLine: 1,
          endColumn: 60
        }
      ]
    },
    {
      filename: 'duplicate-class-directive-array-item.vue',
      code: `<template><div :class="['foo foo']"></div></template>`,
      output: `<template><div :class="['foo']"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'Literal',
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      filename: 'multiple-duplicate-classes-directive-array-items.vue',
      code: `<template><div :class="['foo foo', 'bar bar baz']"></div></template>`,
      output: `<template><div :class="['foo', 'bar baz']"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'Literal',
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 34
        },
        {
          message: "Duplicate class name 'bar'.",
          type: 'Literal',
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 49
        }
      ]
    },
    {
      filename: 'duplicate-class-in-mixed-directive.vue',
      code: `<template><div :class="['foo foo', { 'bar bar baz': true }]"></div></template>`,
      output: `<template><div :class="['foo', { 'bar baz': true }]"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'Literal',
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 34
        },
        {
          message: "Duplicate class name 'bar'.",
          type: 'Literal',
          line: 1,
          column: 38,
          endLine: 1,
          endColumn: 51
        }
      ]
    },
    {
      filename: 'duplicate-class-conditional-expression.vue',
      code: `<template><div :class="isActive ? 'foo foo' : 'bar'"></div></template>`,
      output: `<template><div :class="isActive ? 'foo' : 'bar'"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'Literal',
          line: 1,
          column: 35,
          endLine: 1,
          endColumn: 44
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-expression.vue',
      code: `<template><div :class="'foo foo ' + ' bar'"></div></template>`,
      output: `<template><div :class="'foo ' + ' bar'"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'Literal',
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      filename: 'duplicate-class-preserved-spaces-1.vue',
      code: `<template><div class="foo foo     bar"></div></template>`,
      output: `<template><div class="foo     bar"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'VLiteral',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'duplicate-class-preserved-spaces-2.vue',
      code: `<template><div class="foo bar    baz foo"></div></template>`,
      output: `<template><div class="foo bar    baz"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'VLiteral',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 42
        }
      ]
    },
    {
      filename: 'duplicate-class-preserved-spaces-3.vue',
      code: `<template><div class="foo bar foo     baz"></div></template>`,
      output: `<template><div class="foo bar     baz"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'VLiteral',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 43
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-attribute-string.vue',
      code: `<template><div class="foo" :class="'foo'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'VStartTag',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 43
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-attribute-literal.vue',
      code: '<template><div class="foo" :class="`foo`"></div></template>',
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'VStartTag',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 43
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-attribute.vue',
      code: `<template><div class="foo" :class="'foo bar'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'VStartTag',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 47
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
          type: 'VStartTag',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 51
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-attribute-array.vue',
      code: `<template><div class="foo" :class="['foo', 'bar']"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'VStartTag',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 52
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-attribute-object.vue',
      code: `<template><div class="foo" :class="{ 'foo': true }"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'VStartTag',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 53
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-attribute-mixed.vue',
      code: `<template><div class="foo" :class="['foo', { 'bar': true }]"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'VStartTag',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 62
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-attribute-binary.vue',
      code: `<template><div class="foo" :class="'foo ' + 'bar'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'VStartTag',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 52
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-attribute-conditional.vue',
      code: `<template><div class="foo" :class="isActive ? 'foo' : 'bar'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'VStartTag',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 62
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-node-array.vue',
      code: `<template><div :class="['foo', 'foo']"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'ArrayExpression',
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-node-binary.vue',
      code: `<template><div :class="'foo ' + 'foo'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'BinaryExpression',
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'duplicate-class-cross-node-mixed.vue',
      code: `<template><div :class="['foo', { 'foo': true }]"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'ArrayExpression',
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 48
        }
      ]
    },
    {
      filename: 'duplicate-class-logical-expression-and.vue',
      code: `<template><div :class="isActive && 'foo foo'"></div></template>`,
      output: `<template><div :class="isActive && 'foo'"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'Literal',
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 45
        }
      ]
    },
    {
      filename: 'duplicate-class-logical-expression-or.vue',
      code: `<template><div :class="isActive || 'foo foo'"></div></template>`,
      output: `<template><div :class="isActive || 'foo'"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'Literal',
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 45
        }
      ]
    },
    {
      filename: 'duplicate-class-logical-expression-nullish-coalescing.vue',
      code: `<template><div :class="isActive ?? 'foo foo'"></div></template>`,
      output: `<template><div :class="isActive ?? 'foo'"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'Literal',
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 45
        }
      ]
    },
    {
      filename: 'duplicate-class-nested-logical-expression.vue',
      code: `<template><div :class="isActive ?? isAnotherActive ?? 'foo foo'"></div></template>`,
      output: `<template><div :class="isActive ?? isAnotherActive ?? 'foo'"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'Literal',
          line: 1,
          column: 55,
          endLine: 1,
          endColumn: 64
        }
      ]
    },
    {
      filename: 'duplicate-class-logical-expression-in-array.vue',
      code: `<template><div :class="['foo', isActive ?? 'bar bar']"></div></template>`,
      output: `<template><div :class="['foo', isActive ?? 'bar']"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'bar'.",
          type: 'Literal',
          line: 1,
          column: 44,
          endLine: 1,
          endColumn: 53
        }
      ]
    },
    {
      filename: 'duplicate-class-logical-expression-in-conditional.vue',
      code: `<template><div :class="isAnotherActive ? isActive ?? 'foo foo' : 'bar'"></div></template>`,
      output: `<template><div :class="isAnotherActive ? isActive ?? 'foo' : 'bar'"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'Literal',
          line: 1,
          column: 54,
          endLine: 1,
          endColumn: 63
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-in-logical-expression.vue',
      code: `<template><div :class="isActive && 'bar' + 'bar'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'bar'.",
          type: 'BinaryExpression',
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 49
        }
      ]
    },
    {
      filename: 'duplicate-class-template-literal-in-logical-expression.vue',
      code: '<template><div :class="condition && `foo ${bar} foo`"></div></template>',
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'TemplateLiteral',
          line: 1,
          column: 37,
          endLine: 1,
          endColumn: 53
        }
      ]
    }
  ]
})
