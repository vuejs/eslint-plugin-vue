---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-literals-in-template
description: disallow object literals in template
---

# vue/no-literals-in-template

> disallow object literals in template

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule disallows object literals in template `v-bind` directives.
These literals are created as new references on every rerender, which can cause the child component's watchers to trigger unnecessarily even when the object hasn't actually changed.

<eslint-code-block :rules="{'vue/no-literals-in-template': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div :arr="myArray" />
  <div :obj="myObject" />
  <div :callback="myFunction" />
  <div arr="[]" />
  <!-- class and style bindings are ignored -->
  <div :class="{ active: isActive }" />
  <div :style="{ color: 'red' }" />

  <!-- ✗ BAD -->
  <div :arr="[]" />
  <div :arr="[1, 2, 3]" />
  <div :obj="{}" />
  <div :obj="{ name: 'Tom', age: 123 }" />
  <div :callback="() => someFunction(someArgs)" />
  <div :callback="function() { return 1 }" />
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [vuejs/vue#4060](https://github.com/vuejs/vue/issues/4060)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-literals-in-template.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-literals-in-template.js)
