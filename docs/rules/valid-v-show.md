---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-v-show
description: enforce valid `v-show` directives
since: v3.11.0
---

# vue/valid-v-show

> enforce valid `v-show` directives

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `*.configs["flat/essential"]`, `"plugin:vue/essential"`, `*.configs["flat/vue2-essential"]`, `"plugin:vue/vue3-strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/strongly-recommended"`, `*.configs["flat/vue2-strongly-recommended"]`, `"plugin:vue/vue3-recommended"`, `*.configs["flat/recommended"]`, `"plugin:vue/recommended"` and `*.configs["flat/vue2-recommended"]`.

This rule checks whether every `v-show` directive is valid.

## :book: Rule Details

This rule reports `v-show` directives in the following cases:

- The directive has that argument. E.g. `<div v-show:aaa></div>`
- The directive has that modifier. E.g. `<div v-show.bbb></div>`
- The directive does not have that attribute value. E.g. `<div v-show></div>`
- The directive is put on `<template>` tag. E.g. `<template v-show="condition" />`

<eslint-code-block :rules="{'vue/valid-v-show': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-show="foo" />

  <!-- ✗ BAD -->
  <div v-show />
  <div v-show:aaa="foo" />
  <div v-show.bbb="foo" />
  <template v-show="condition" />
</template>
```

</eslint-code-block>

::: warning Note
This rule does not check syntax errors in directives because it's checked by [vue/no-parsing-error] rule.
:::

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/no-parsing-error]

[vue/no-parsing-error]: ./no-parsing-error.md

## :rocket: Version

This rule was introduced in eslint-plugin-vue v3.11.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-v-show.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-v-show.js)
