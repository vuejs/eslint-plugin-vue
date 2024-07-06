---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-default-export
description: require components to be the default export
---

# vue/require-default-export

> require components to be the default export

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule reports when a Vue component does not have a default export, if the component is not defined as `<script setup>`.

<eslint-code-block :rules="{'vue/require-default-export': ['error']}">

```vue
<!-- ✗ BAD -->
<script>
const foo = 'foo';
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/require-default-export': ['error']}">

```vue
<!-- ✓ GOOD -->
<script>
export default {
  data() {
    return {
      foo: 'foo'
    };
  }
};
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/one-component-per-file](./one-component-per-file.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-default-export.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-default-export.js)
