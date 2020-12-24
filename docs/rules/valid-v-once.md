---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-v-once
description: enforce valid `v-once` directives
since: v3.11.0
---
# vue/valid-v-once

> enforce valid `v-once` directives

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every `v-once` directive is valid.

## :book: Rule Details

This rule reports `v-once` directives in the following cases:

- The directive has that argument. E.g. `<div v-once:aaa></div>`
- The directive has that modifier. E.g. `<div v-once.bbb></div>`
- The directive has that attribute value. E.g. `<div v-once="ccc"></div>`

<eslint-code-block :rules="{'vue/valid-v-once': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-once/>

  <!-- ✗ BAD -->
  <div v-once:aaa/>
  <div v-once.bbb/>
  <div v-once="ccc"/>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v3.11.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-v-once.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-v-once.js)
