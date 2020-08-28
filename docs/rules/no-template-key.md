---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-template-key
description: disallow `key` attribute on `<template>`
---
# vue/no-template-key
> disallow `key` attribute on `<template>`

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

Vue.js disallows `key` attribute on `<template>` elements.

## :book: Rule Details

This rule reports the `<template>` elements which have `key` attribute.

<eslint-code-block :rules="{'vue/no-template-key': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div key="foo"> ... </div>
  <template> ... </template>

  <!-- It's valid for Vue.js 3.x -->
  <template v-for="item in list" :key="item.id"> ... </template>

  <!-- ✗ BAD -->
  <template key="foo"> ... </template>
  <template v-bind:key="bar"> ... </template>
  <template :key="baz"> ... </template>
</template>
```

</eslint-code-block>

::: tip Note
This rule does not report keys placed on `<template v-for>`. It's valid for Vue.js 3.x. If you want to report keys placed on `<template v-for>` invalid for Vue.js 2.x, use [vue/no-v-for-template-key] rule.
:::

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/no-v-for-template-key]

[vue/no-v-for-template-key]: ./no-v-for-template-key.md

## :books: Further Reading

- [API - Special Attributes - key](https://v3.vuejs.org/api/special-attributes.html#key)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-template-key.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-template-key.js)
