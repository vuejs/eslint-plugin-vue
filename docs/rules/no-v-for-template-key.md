---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-v-for-template-key
description: disallow `key` attribute on `<template v-for>`
since: v7.0.0
---
# vue/no-v-for-template-key

> disallow `key` attribute on `<template v-for>`

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule reports the `<template v-for>` elements which have `key` attribute.

In Vue.js 2.x, disallows `key` attribute on `<template>` elements.

::: warning Note
Do not use with the [vue/no-v-for-template-key-on-child] rule for Vue.js 3.x.  
This rule conflicts with the [vue/no-v-for-template-key-on-child] rule.
:::

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

- [vue/no-template-key]
- [vue/no-v-for-template-key-on-child]

[vue/no-template-key]: ./no-template-key.md
[vue/no-v-for-template-key-on-child]: ./no-v-for-template-key-on-child.md

## :books: Further Reading

- [API - Special Attributes - key](https://v3.vuejs.org/api/special-attributes.html#key)
- [API (for v2) - Special Attributes - key](https://v2.vuejs.org/v2/api/#key)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-v-for-template-key.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-v-for-template-key.js)
