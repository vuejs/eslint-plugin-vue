---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-v-for-template-key
description: disallow `key` attribute on `<template v-for>`
---
# vue/no-v-for-template-key
> disallow `key` attribute on `<template v-for>`

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

Vue.js disallows `key` attribute on `<template>` elements.

## :book: Rule Details

This rule reports the `<template v-for>` elements which have `key` attribute.

<eslint-code-block :rules="{'vue/no-v-for-template-key': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <template v-for="item in list">
    <div :key="item.id" />
  </template>

  <!-- ✗ BAD -->
  <template v-for="item in list" :key="item.id">
    <div />
  </template>
</template>
```

</eslint-code-block>

::: tip Note
If you want to report keys placed on `<template>` without `v-for`, use the [vue/no-template-key] rule.
:::

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/no-template-key](./no-template-key.md)

[vue/no-template-key]: ./no-template-key.md

## :books: Further Reading

- [API - Special Attributes - key](https://v3.vuejs.org/api/special-attributes.html#key)
- [API (for v2) - Special Attributes - key](https://vuejs.org/v2/api/#key)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-v-for-template-key.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-v-for-template-key.js)
