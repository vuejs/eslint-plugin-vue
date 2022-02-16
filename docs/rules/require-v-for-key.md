---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-v-for-key
description: require `v-bind:key` with `v-for` directives
since: v3.0.0
---
# vue/require-v-for-key

> require `v-bind:key` with `v-for` directives

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule reports the elements which have `v-for` and do not have `v-bind:key` with exception to custom components.

<eslint-code-block :rules="{'vue/require-v-for-key': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div
    v-for="todo in todos"
    :key="todo.id"
  />
  <!-- ✗ BAD -->
  <div v-for="todo in todos"/>
</template>
```

</eslint-code-block>

::: warning Note
This rule does not report missing `v-bind:key` on custom components.
It will be reported by [vue/valid-v-for] rule.
:::

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/valid-v-for]

[vue/valid-v-for]: ./valid-v-for.md

## :books: Further Reading

- [Style guide - Keyed v-for](https://vuejs.org/style-guide/rules-essential.html#use-keyed-v-for)
- [Guide (for v2) - v-for with a Component](https://v2.vuejs.org/v2/guide/list.html#v-for-with-a-Component)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v3.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-v-for-key.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-v-for-key.js)
