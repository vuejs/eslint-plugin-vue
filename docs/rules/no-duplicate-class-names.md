---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-duplicate-class-names
description: disallow duplication of class names in class attributes
since: v10.6.0
---

# vue/no-duplicate-class-names

> disallow duplication of class names in class attributes

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule prevents the same class name from appearing multiple times within the same class attribute or directive.

<eslint-code-block fix :rules="{'vue/no-duplicate-class-names': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div class="foo bar"></div>
  <div :class="'foo bar'"></div>
  <div :class="{ 'foo bar': isActive }"></div>
  <div :class="['foo', 'bar']"></div>
  <div :class="isActive ? 'foo' : 'bar'"></div>
  <div class="foo" :class="{ bar: isActive }"></div>
  
  <!-- ✗ BAD -->
  <div class="foo foo"></div>
  <div class="foo bar foo baz bar"></div>
  <div :class="'foo foo'"></div>
  <div :class="`foo foo`"></div>
  <div :class="{ 'foo foo': isActive }"></div>
  <div :class="['foo foo']"></div>
  <div :class="['foo foo', { 'bar bar baz': isActive }]"></div>
  <div :class="isActive ? 'foo foo' : 'bar'"></div>
  <div :class="'foo foo ' + 'bar'"></div>
  <div class="foo" :class="'foo'"></div>
  <div :class="['foo', 'foo']"></div>
  <div :class="'foo ' + 'foo'"></div>
  <div :class="['foo', { 'foo': isActive }]"></div>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v10.6.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-duplicate-class-names.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-duplicate-class-names.js)
