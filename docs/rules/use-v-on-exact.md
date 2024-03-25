---
pageClass: rule-details
sidebarDepth: 0
title: vue/use-v-on-exact
description: enforce usage of `exact` modifier on `v-on`
since: v5.0.0
---

# vue/use-v-on-exact

> enforce usage of `exact` modifier on `v-on`

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `*.configs["flat/essential"]`, `"plugin:vue/essential"`, `*.configs["flat/vue2-essential"]`, `"plugin:vue/vue3-strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/strongly-recommended"`, `*.configs["flat/vue2-strongly-recommended"]`, `"plugin:vue/vue3-recommended"`, `*.configs["flat/recommended"]`, `"plugin:vue/recommended"` and `*.configs["flat/vue2-recommended"]`.

## :book: Rule Details

This rule enforce usage of `exact` modifier on `v-on` when there is another `v-on` with modifier.

<eslint-code-block :rules="{'vue/use-v-on-exact': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button @click="foo" :click="foo"></button>
  <button v-on:click.exact="foo" v-on:click.ctrl="foo"></button>

  <!-- ✗ BAD -->
  <button v-on:click="foo" v-on:click.ctrl="foo"></button>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/v-on-style](./v-on-style.md)
- [vue/valid-v-on](./valid-v-on.md)

## :books: Further Reading

- [Guide - .exact Modifier](https://vuejs.org/guide/essentials/event-handling.html#exact-modifier)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v5.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/use-v-on-exact.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/use-v-on-exact.js)
