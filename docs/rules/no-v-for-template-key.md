---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-v-for-template-key
description: disallow `key` attribute on `<template v-for>`
since: v7.0.0
---

# vue/no-v-for-template-key

> disallow `key` attribute on `<template v-for>`

- :no_entry_sign: This rule was **deprecated**.
- :gear: This rule is included in all of `"plugin:vue/vue2-essential"`, `*.configs["flat/vue2-essential"]`, `"plugin:vue/vue2-strongly-recommended"`, `*.configs["flat/vue2-strongly-recommended"]`, `"plugin:vue/vue2-recommended"` and `*.configs["flat/vue2-recommended"]`.

## :book: Rule Details

This rule reports the `<template v-for>` elements which have `key` attribute.

In Vue.js 2.x, disallows `key` attribute on `<template>` elements.

::: warning Note
This rule is targeted at Vue.js 2.x.
If you are using Vue.js 3.x, enable the [vue/no-v-for-template-key-on-child] rule instead. Don't enable both rules together; they are conflicting.
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

- [API - Special Attributes - key](https://vuejs.org/api/built-in-special-attributes.html#key)
- [API (for v2) - Special Attributes - key](https://v2.vuejs.org/v2/api/#key)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-v-for-template-key.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-v-for-template-key.js)
