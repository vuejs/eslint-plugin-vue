---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-v-cloak
description: enforce valid `v-cloak` directives
---
# vue/valid-v-cloak
> enforce valid `v-cloak` directives

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every `v-cloak` directive is valid.

## :book: Rule Details

This rule reports `v-cloak` directives in the following cases:

- The directive has that argument. E.g. `<div v-cloak:aaa></div>`
- The directive has that modifier. E.g. `<div v-cloak.bbb></div>`
- The directive has that attribute value. E.g. `<div v-cloak="ccc"></div>`

<eslint-code-block :rules="{'vue/valid-v-cloak': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-cloak/>

  <!-- ✗ BAD -->
  <div v-cloak:aaa/>
  <div v-cloak.bbb/>
  <div v-cloak="ccc"/>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-v-cloak.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-v-cloak.js)
