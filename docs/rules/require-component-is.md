---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-component-is
description: require `v-bind:is` of `<component>` elements
since: v3.0.0
---

# vue/require-component-is

> require `v-bind:is` of `<component>` elements

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `*.configs["flat/essential"]`, `"plugin:vue/essential"`, `*.configs["flat/vue2-essential"]`, `"plugin:vue/vue3-strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/strongly-recommended"`, `*.configs["flat/vue2-strongly-recommended"]`, `"plugin:vue/vue3-recommended"`, `*.configs["flat/recommended"]`, `"plugin:vue/recommended"` and `*.configs["flat/vue2-recommended"]`.

## :book: Rule Details

This rule reports the `<component>` elements which do not have `v-bind:is` attributes.

<eslint-code-block :rules="{'vue/require-component-is': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <component :is="type" />
  <component v-bind:is="type" />

  <!-- ✗ BAD -->
  <component />
  <component is="type" />
</template>
```

</eslint-code-block>

::: warning Note
You can use the same mount point and dynamically switch between multiple components using the reserved `<component>` element and dynamically bind to its `is` attribute.
:::

## :wrench: Options

Nothing.

## :books: Further Reading

- [Guide - Components Basics / Dynamic Components](https://vuejs.org/guide/essentials/component-basics.html#dynamic-components)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v3.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-component-is.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-component-is.js)
