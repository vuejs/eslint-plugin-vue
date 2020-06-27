---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-filter
description: disallow using deprecated filters syntax (in Vue.js 3.0.0+)
---
# vue/no-deprecated-filter
> disallow using deprecated filters syntax (in Vue.js 3.0.0+)

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.

## :book: Rule Details

This rule reports deprecated `filters` syntax (removed in Vue.js v3.0.0+)

<eslint-code-block :rules="{'vue/no-deprecated-filter': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  {{ filter(msg) }}
  {{ filter(msg, '€') }}
  {{ filterB(filterA(msg)) }}
  <div v-bind:id="filter(msg)"></div>
  <div v-bind:id="filter(msg, '€')"></div>
  <div v-bind:id="filterB(filterA(msg))"></div>

  <!-- ✗ BAD -->
  {{ msg | filter }}
  {{ msg | filter('€') }}
  {{ msg | filterA | filterB }}
  <div v-bind:id="msg | filter"></div>
  <div v-bind:id="msg | filter('€')"></div>
  <div v-bind:id="msg | filterA | filterB"></div>
</template>
```

</eslint-code-block>

### :wrench: Options

Nothing.

## :books: Further Reading

- [Vue RFCs - 0015-remove-filters](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0015-remove-filters.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-filter.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-filter.js)
