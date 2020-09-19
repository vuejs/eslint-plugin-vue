---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-v-for-template-key-on-child
description: disallow key of `<template v-for>` placed on child elements
---
# vue/no-v-for-template-key-on-child
> disallow key of `<template v-for>` placed on child elements

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.

## :book: Rule Details

This rule reports the key of the `<template v-for>` placed on the child elements.

In Vue.js 3.x, with the support for fragments, the `<template v-for>` key can be placed on the `<template>` tag.  

See [Migration Guide - `key` attribute > With `<template v-for>`](https://v3.vuejs.org/guide/migration/key-attribute.html#with-template-v-for) for more details.

::: warning Note
Do not use with the [vue/no-v-for-template-key] rule for Vue.js 2.x.  
This rule conflicts with the [vue/no-v-for-template-key] rule.
:::

<eslint-code-block :rules="{'vue/no-v-for-template-key-on-child': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <template v-for="todo in todos" :key="todo">
    <Foo />
  </template>

  <!-- ✗ BAD -->
  <template v-for="todo in todos">
    <Foo :key="todo" />
  </template>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/no-v-for-template-key]

[vue/no-v-for-template-key]: ./no-v-for-template-key.md

## :books: Further Reading

- [Migration Guide - `key` attribute > With `<template v-for>`](https://v3.vuejs.org/guide/migration/key-attribute.html#with-template-v-for)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-v-for-template-key-on-child.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-v-for-template-key-on-child.js)
