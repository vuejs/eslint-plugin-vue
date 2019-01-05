---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-component-is
description: require `v-bind:is` of `<component>` elements
---
# vue/require-component-is
> require `v-bind:is` of `<component>` elements

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule reports the `<component>` elements which do not have `v-bind:is` attributes.


<eslint-code-block :rules="{'vue/require-component-is': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <component :is="type"/>
  <component v-bind:is="type"/>

  <!-- ✗ BAD -->
  <component/>
  <component is="type"/>
</template>
```

</eslint-code-block>

::: warning Note
You can use the same mount point and dynamically switch between multiple components using the reserved `<component>` element and dynamically bind to its `is` attribute.
:::


## :wrench: Options

Nothing.

## :books: Further reading

- [Guide - Dynamic Components](https://vuejs.org/v2/guide/components.html#Dynamic-Components)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-component-is.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-component-is.js)
