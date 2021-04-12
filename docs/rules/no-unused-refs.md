---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-unused-refs
description: disallow unused refs
---
# vue/no-unused-refs

> disallow unused refs

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule is aimed at eliminating unused refs.
This rule reports refs that are defined using the `ref` attribute in `<template>` but are not used via `$refs`.

::: warning Note
This rule cannot be checked for use in other components (e.g. `mixins`, Access via `$refs.x.$refs`).
:::

<eslint-code-block :rules="{'vue/no-unused-refs': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <input ref="foo" />

  <!-- ✗ BAD (`bar` is not used) -->
  <input ref="bar" />
</template>
<script>
export default {
  mounted() {
    this.$refs.foo.value = 'foo'
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-unused-refs.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-unused-refs.js)
