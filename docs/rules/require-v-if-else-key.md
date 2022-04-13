---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-v-if-else-key
description: require `key` with `v-if/v-else-if/v-else` directives
---
# vue/require-v-if-else-key

> require `key` with `v-if/v-else-if/v-else` directives

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule reports the elements which have `v-if`, `v-else-if`, and/or `v-else` and do not have a `v-bind:key` or `key`.

<eslint-code-block :rules="{'vue/require-v-if-else-key': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-if="condition"/>

  <div v-if="condition"/>
  <span v-else>

  <div v-if="condition" key="one"/>
  <div v-else key="two"/>

  <div v-if="condition" :key="one"/>
  <div v-else :key="two"/>

  <!-- ✗ BAD -->
  <div v-if="condition"/>
  <div v-else/>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Guide (for v2) - v-if without key](https://v2.vuejs.org/v2/style-guide/?redirect=true#v-if-v-else-if-v-else-without-key-use-with-caution)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-v-if-else-key.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-v-if-else-key.js)
