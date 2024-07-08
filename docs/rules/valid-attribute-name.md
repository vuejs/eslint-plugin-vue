---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-attribute-name
description: require valid attribute names
since: v9.0.0
---

# vue/valid-attribute-name

> require valid attribute names

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `*.configs["flat/essential"]`, `"plugin:vue/essential"`, `*.configs["flat/vue2-essential"]`, `"plugin:vue/vue3-strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/strongly-recommended"`, `*.configs["flat/vue2-strongly-recommended"]`, `"plugin:vue/vue3-recommended"`, `*.configs["flat/recommended"]`, `"plugin:vue/recommended"` and `*.configs["flat/vue2-recommended"]`.

## :book: Rule Details

This rule detects invalid HTML attributes.

<eslint-code-block :rules="{'vue/valid-attribute-name': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <p foo.bar></p>
  <p foo-bar></p>
  <p _foo.bar></p>
  <p :foo-bar></p>

  <!-- ✗ BAD -->
  <p 0abc></p>
  <p -def></p>
  <p !ghi></p>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-attribute-name.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-attribute-name.js)
