/**
 * @author Yizack Rangel
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-duplicate-class-names'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
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
    },
    {
      filename: 'class-template-literal-prefixes.vue',
      code: '<template><h1 :class="`text-${size} font-weight-${weight} text-${color}`"></h1></template>'
    },
    {
      filename: 'class-template-literal-suffixes.vue',
      code: '<template><div :class="`${a}-active ${b}-active`"></div></template>'
    },
    {
      filename: 'class-binary-prefixes.vue',
      code: `<template><div :class="'text-' + size + ' text-' + color"></div></template>`
    },
    {
      filename: 'class-binary-chain-suffix.vue',
      code: `<template><div :class="'btn ' + type + ' btn' + size"></div></template>`
    },
    {
      filename: 'class-binary-joined-prefix.vue',
      code: `<template><div :class="'tag' + 'tag tag'"></div></template>`
    },
    {
      filename: 'class-binary-joined-suffix.vue',
      code: `<template><div :class="'tag tag' + 'tag'"></div></template>`
    },
    {
      filename: 'class-binary-joined-whole.vue',
      code: `<template><div :class="'tag' + 'tag'"></div></template>`
    },
    {
      filename: 'class-binary-joined-partial.vue',
      code: `<template><div :class="'a-' + 'b a-'"></div></template>`
    },
    {
      filename: 'class-binary-joined-parenthesized.vue',
      code: `<template><div :class="'tag' + ('tag tag')"></div></template>`
    },
    {
      filename: 'class-binary-joined-template-literals.vue',
      code: '<template><div :class="`tag` + `tag tag`"></div></template>'
    },
    {
      filename: 'class-binary-joined-empty-string.vue',
      code: `<template><div :class="'a b' + '' + 'b'"></div></template>`
    },
    {
      filename: 'class-binary-joined-both-sides.vue',
      code: `<template><div :class="'b' + 'a a' + 'c'"></div></template>`
    },
    {
      filename: 'class-binary-with-expression-prefix.vue',
      code: `<template><div :class="'a' + size + ' a'"></div></template>`
    },
    {
      filename: 'class-binary-joined-non-intersecting.vue',
      code: `<template><div :class="[isActive1 && 'ta' + 'g', isActive2 && 'tag']"></div></template>`
    },
    {
      filename: 'class-binary-template-literal-with-expression-prefix.vue',
      code: '<template><div :class="size + `b b` + \'ab\'"></div></template>'
    },
    {
      filename: 'class-binary-empty-string-before-expression.vue',
      code: `<template><div :class="'a a' + '' + size"></div></template>`
    },
    {
      filename: 'class-conditional-glued-in-binary.vue',
      code: `<template><div :class="'x-' + (c ? 'a a' : 'b')"></div></template>`
    },
    {
      filename: 'class-conditional-glued-to-binary.vue',
      code: `<template><div :class="'a x' + (c ? 'a' : 'b')"></div></template>`
    },
    {
      filename: 'class-conditional-glued-in-one-branch.vue',
      code: `<template><div :class="(c ? 'x' : 'y ') + 'a a'"></div></template>`
    },
    {
      filename: 'class-conditional-non-intersecting-in-binary.vue',
      code: `<template><div :class="(c ? 'a ' : 'b ') + (d ? 'a' : 'b')"></div></template>`
    },
    {
      filename: 'class-conditional-empty-branch-in-binary.vue',
      code: `<template><div :class="'a' + (c ? '' : ' ') + 'a'"></div></template>`
    },
    {
      filename: 'class-conditional-impossible-combination.vue',
      code: `<template><div class="ab" :class="(c ? 'a' : 'x ') + (c ? ' y' : 'b')"></div></template>`
    },
    {
      filename: 'class-conditional-impossible-combination-in-array.vue',
      code: `<template><div :class="['ab', (c ? 'a' : 'x ') + (c ? ' y' : 'b')]"></div></template>`
    },
    {
      filename: 'class-conditional-nested-same-condition.vue',
      code: `<template><div :class="'' + (c ? 'a ' + (c ? 'b' : 'a') : '')"></div></template>`
    },
    {
      // `icon` may be glued to `dark`, since conditions are not correlated
      filename: 'class-conditional-correlated-conditions.vue',
      code: `<template><div :class="'icon' + (dark ? ' ' : '') + (dark ? 'dark' : ' light') + ' icon'"></div></template>`
    },
    {
      // `a` is duplicated in each branch, but with different neighbors
      filename: 'class-conditional-different-pairs.vue',
      code: `<template><div :class="'a a' + (c ? 'b ' : ' b') + 'a'"></div></template>`
    },
    {
      filename: 'class-logical-expression-in-template-literal.vue',
      code: "<template><div :class=\"`x${c && 'ab'} a${'b'}`\"></div></template>"
    },
    {
      // `classList` splits on ASCII whitespace only
      filename: 'class-non-ascii-whitespace.vue',
      code: String.raw`<template><div :class="[${'`'}a\va${'`'}, 'b\u00a0b', ${'`'}c\ufeff${'`'} + 'c']"></div></template>`
    },
    {
      filename: 'class-binary-typescript-glued.vue',
      code: `<template><div :class="'a a' + (x as string)"></div></template>`,
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
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
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'duplicate-class-directive-object-template-key.vue',
      code: '<template><div :class="{ [`foo foo`]: true }"></div></template>',
      output: '<template><div :class="{ [`foo`]: true }"></div></template>',
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 36
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
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 39
        },
        {
          message: "Duplicate class name 'bar'.",
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
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 34
        },
        {
          message: "Duplicate class name 'bar'.",
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
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 34
        },
        {
          message: "Duplicate class name 'bar'.",
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
          line: 1,
          column: 54,
          endLine: 1,
          endColumn: 63
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-in-logical-expression.vue',
      code: `<template><div :class="isActive && 'bar' + ' bar'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'bar'.",
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 50
        }
      ]
    },
    {
      filename: 'duplicate-class-template-literal-in-logical-expression.vue',
      code: '<template><div :class="isActive && `foo ${bar} foo`"></div></template>',
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 52
        }
      ]
    },
    {
      filename: 'duplicate-class-template-literal-with-expression.vue',
      code: '<template><div :class="`foo ${size} foo`"></div></template>',
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 41
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-with-expression.vue',
      code: `<template><div :class="'foo ' + size + ' foo'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-chain.vue',
      code: `<template><div :class="'foo ' + 'bar ' + 'foo'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-with-template-literal.vue',
      code: '<template><div :class="\'foo\' + ` foo ${size}`"></div></template>',
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 46
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-with-prefix.vue',
      code: `<template><div :class="prefix + 'btn btn shadow shadow'"></div></template>`,
      output: `<template><div :class="prefix + 'btn btn shadow'"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'shadow'.",
          line: 1,
          column: 33,
          endLine: 1,
          endColumn: 56
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-with-suffix.vue',
      code: `<template><div :class="'shadow shadow btn btn' + suffix"></div></template>`,
      output: `<template><div :class="'shadow btn btn' + suffix"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'shadow'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 47
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-joined.vue',
      code: `<template><div :class="'ta' + 'g tag'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'tag'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-joined-hyphen.vue',
      code: `<template><div :class="'a-' + 'b a-b'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'a-b'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-joined-parenthesized.vue',
      code: `<template><div :class="('a' + 'b') + ' ab'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'ab'.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-joined-chain.vue',
      code: `<template><div :class="'ta' + 'g ta' + 'g'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'tag'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-joined-template-literals.vue',
      code: '<template><div :class="`ta` + `g tag`"></div></template>',
      output: null,
      errors: [
        {
          message: "Duplicate class name 'tag'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-joined-in-operand.vue',
      code: `<template><div :class="'ta' + 'g tag tag'"></div></template>`,
      output: `<template><div :class="'ta' + 'g tag'"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'tag'.",
          line: 1,
          column: 31,
          endLine: 1,
          endColumn: 42
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-empty-string.vue',
      code: `<template><div :class="'' + 'foo foo'"></div></template>`,
      output: `<template><div :class="'' + 'foo'"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          line: 1,
          column: 29,
          endLine: 1,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-separated.vue',
      code: `<template><div :class="'a b' + ' a'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'a'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-separated-by-escapes.vue',
      code: String.raw`<template><div :class="'a\t' + 'a' + '\na'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'a'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-chain-in-logical-expression.vue',
      code: `<template><div :class="isActive && 'foo ' + 'bar ' + 'foo'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 51
        }
      ]
    },
    {
      filename:
        'duplicate-class-binary-with-expression-in-logical-expression.vue',
      code: `<template><div :class="isActive && 'foo ' + size + ' foo'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 49
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-joined-cross-node.vue',
      code: `<template><div :class="[isActive && 'ta' + 'g', 'tag']"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'tag'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 55
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-in-template-literal.vue',
      code: "<template><div :class=\"`x ${'a' + ' b'} b`\"></div></template>",
      output: null,
      errors: [
        {
          message: "Duplicate class name 'b'.",
          line: 1,
          column: 29,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'duplicate-class-template-literal-last-quasi.vue',
      code: '<template><div :class="`${a} b b`"></div></template>',
      output: '<template><div :class="`${a} b`"></div></template>',
      errors: [
        {
          message: "Duplicate class name 'b'.",
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      filename: 'duplicate-class-template-literal-middle-quasi.vue',
      code: '<template><div :class="`${a} b b ${c}`"></div></template>',
      output: '<template><div :class="`${a} b ${c}`"></div></template>',
      errors: [
        {
          message: "Duplicate class name 'b'.",
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      filename: 'duplicate-class-template-literal-first-quasi.vue',
      code: '<template><div :class="`b b ${c}`"></div></template>',
      output: '<template><div :class="`b ${c}`"></div></template>',
      errors: [
        {
          message: "Duplicate class name 'b'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-after-conditional.vue',
      code: `<template><div :class="(c ? 'x ' : 'y ') + 'a a'"></div></template>`,
      output: `<template><div :class="(c ? 'x ' : 'y ') + 'a'"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'a'.",
          line: 1,
          column: 44,
          endLine: 1,
          endColumn: 49
        }
      ]
    },
    {
      filename: 'duplicate-class-template-literal-after-conditional.vue',
      code: "<template><div :class=\"`${active ? 'is-active ' : ''}btn btn`\"></div></template>",
      output:
        "<template><div :class=\"`${active ? 'is-active ' : ''}btn`\"></div></template>",
      errors: [
        {
          message: "Duplicate class name 'btn'.",
          line: 1,
          column: 53,
          endLine: 1,
          endColumn: 62
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-chain-after-conditional.vue',
      code: `<template><div :class="(c ? 'x ' : '') + 'a ' + 'a'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'a'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 46
        }
      ]
    },
    {
      filename: 'duplicate-class-conditional-in-binary.vue',
      code: `<template><div :class="'x ' + (c ? 'a a' : 'b')"></div></template>`,
      output: `<template><div :class="'x ' + (c ? 'a' : 'b')"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'a'.",
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 41
        }
      ]
    },
    {
      filename: 'duplicate-class-conditional-and-binary.vue',
      code: `<template><div :class="(c ? 'a' : 'b') + ' a'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'a'.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-before-conditional.vue',
      code: `<template><div :class="'a ' + 'a ' + (c ? 'b' : '')"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'a'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-many-conditionals.vue',
      code: `<template><div :class="'btn' + (c0 ? ' x0' : ' y0') + (c1 ? ' x1' : ' y1') + (c2 ? ' x2' : ' y2') + (c3 ? ' x3' : ' y3') + (c4 ? ' x4' : ' y4') + (c5 ? ' x5' : ' y5') + ' btn'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'btn'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 52
        }
      ]
    },
    {
      filename: 'duplicate-class-binary-before-escaped-whitespace.vue',
      code: '<template><div :class="\'b b\' + `\\n`"></div></template>',
      output: '<template><div :class="\'b\' + `\\n`"></div></template>',
      errors: [
        {
          message: "Duplicate class name 'b'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'duplicate-class-with-escape.vue',
      code: String.raw`<template><div :class="'a\tb a'"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'a'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'duplicate-class-logical-expression-in-binary.vue',
      code: `<template><div :class="'foo ' + (isActive && 'foo')"></div></template>`,
      output: null,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 52
        }
      ]
    },
    {
      filename: 'duplicate-class-crlf.vue',
      code: '<template>\r\n<div class="a b\r\na"></div>\r\n<div :class="`a b\r\na ${x}`"></div>\r\n</template>',
      output:
        '<template>\r\n<div class="a b"></div>\r\n<div :class="`a b ${x}`"></div>\r\n</template>',
      errors: [
        {
          message: "Duplicate class name 'a'.",
          line: 2,
          column: 12,
          endLine: 3,
          endColumn: 3
        },
        {
          message: "Duplicate class name 'a'.",
          line: 4,
          column: 14,
          endLine: 5,
          endColumn: 5
        }
      ]
    },
    {
      filename: 'duplicate-class-template-literal-typescript.vue',
      code: '<template><div :class="`${y as any} b b ${z!}`"></div></template>',
      output: '<template><div :class="`${y as any} b ${z!}`"></div></template>',
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: "Duplicate class name 'b'.",
          line: 1,
          column: 35,
          endLine: 1,
          endColumn: 43
        }
      ]
    },
    {
      filename: 'duplicate-class-logical-typescript.vue',
      code: `<template><div :class="(c! && 'a b') + ' a'"></div></template>`,
      output: null,
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: "Duplicate class name 'a'.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 36
        }
      ]
    }
  ]
})
