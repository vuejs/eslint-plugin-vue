---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-direct-composable-in-event-handler
description: disallow direct composable usage in event handler
since: v10.1.0
---

# vue/no-direct-composable-in-event-handler

> disallow direct composable usage in event handler

- :gear: This rule is included in all of `"plugin:vue/essential"`, `*.configs["flat/essential"]`, `"plugin:vue/strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/recommended"` and `*.configs["flat/recommended"]`.

This rule prevents directly calling a composable function in an event handler.

## :book: Rule Details

This rule prevents directly calling a composable function in an event handler. If something starts with `use`, it is considered a composable function.

<eslint-code-block :rules="{'vue/no-direct-composable-in-event-handler': ['error']}">

```vue
<template>
  <!-- ✗ BAD -->
  <button @click="useFoo">Click me</button>
</template>

<script setup>
function useFoo() {}
</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v10.1.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-direct-composable-in-event-handler.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-direct-composable-in-event-handler.js)
