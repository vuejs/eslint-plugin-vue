---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-v-is
description: enforce valid `v-is` directives
---
# vue/valid-v-is
> enforce valid `v-is` directives

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.

This rule checks whether every `v-is` directive is valid.

## :book: Rule Details

This rule reports `v-is` directives in the following cases:

- The directive has that argument. E.g. `<div v-is:aaa="foo"></div>`
- The directive has that modifier. E.g. `<div v-is.bbb="foo"></div>`
- The directive does not have that attribute value. E.g. `<div v-is></div>`
- The directive is on Vue-components. E.g. `<MyComponent v-is="foo"></MyComponent>`

<eslint-code-block :rules="{'vue/valid-v-is': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <tr v-is="'blog-post-row'"></tr>
  <tr v-is="foo"></tr>

  <!-- ✗ BAD -->
  <tr v-is:a="foo"></tr>
  <tr v-is.m="foo"></tr>
  <tr v-is></tr>
  <tr v-is=""></tr>
  <MyComponent v-is="foo" />
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

## :books: Further Reading

- [API - v-is](https://v3.vuejs.org/api/directives.html#v-is)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-v-is.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-v-is.js)
