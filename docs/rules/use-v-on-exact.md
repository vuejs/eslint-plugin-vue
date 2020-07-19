---
pageClass: rule-details
sidebarDepth: 0
title: vue/use-v-on-exact
description: enforce usage of `exact` modifier on `v-on`
---
# vue/use-v-on-exact
> enforce usage of `exact` modifier on `v-on`

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

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

```json
{
  "vue/use-v-on-exact": ["error"]
}
```

## :couple: Related Rules

- [vue/v-on-style](./v-on-style.md)
- [vue/valid-v-on](./valid-v-on.md)

## :books: Further Reading

- [Guide - .exact Modifier](https://v3.vuejs.org/guide/events.html#exact-modifier)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/use-v-on-exact.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/use-v-on-exact.js)
