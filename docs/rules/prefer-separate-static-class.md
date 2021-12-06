---
pageClass: rule-details
sidebarDepth: 0
title: vue/prefer-separate-static-class
description: require static class names in template to be in a separate `class` attribute
since: v8.2.0
---
# vue/prefer-separate-static-class

> require static class names in template to be in a separate `class` attribute

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports static class names in dynamic class attributes.

<eslint-code-block fix :rules="{'vue/prefer-separate-static-class': ['error']}">

```vue
<template>
  <!-- ✗ BAD -->
  <div :class="'static-class'" />
  <div :class="{'static-class': true, 'dynamic-class': foo}" />
  <div :class="['static-class', dynamicClass]" />

  <!-- ✓ GOOD -->
  <div class="static-class" />
  <div class="static-class" :class="{'dynamic-class': foo}" />
  <div class="static-class" :class="[dynamicClass]" />
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v8.2.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/prefer-separate-static-class.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/prefer-separate-static-class.js)
