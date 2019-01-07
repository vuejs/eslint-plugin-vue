---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-template-key
description: disallow `key` attribute on `<template>`
---
# vue/no-template-key
> disallow `key` attribute on `<template>`

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

Vue.js disallows `key` attribute on `<template>` elements.

## :book: Rule Details

This rule reports the `<template>` elements which have `key` attribute.

<eslint-code-block :rules="{'vue/no-template-key': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div key="foo"> ... </div>
  <template> ... </template>

  <!-- ✗ BAD -->
  <template key="foo"> ... </template>
  <template v-bind:key="bar"> ... </template>
  <template :key="baz"> ... </template>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further reading

- [API - Special Attributes - key](https://vuejs.org/v2/api/#key)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-template-key.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-template-key.js)
