---
pageClass: rule-details
sidebarDepth: 0
title: vue/restricted-component-names
description: enforce using only specific component names
---

# vue/restricted-component-names

> enforce using only specific component names

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule enforces consistency in component names.

<eslint-code-block :rules="{ 'vue/restricted-component-names': ['error'] }">

```vue
<template>
  <!-- ✓ GOOD -->
  <button/>
  <keep-alive></keep-alive>

  <!-- ✗ BAD -->
  <custom-component />
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/restricted-component-names": ["error", { 
    "allow": []
  }]
}
```

### `"allow"`

<eslint-code-block :rules="{'vue/restricted-component-names': ['error', { 'allow': ['/^custom-/'] }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <custom-component />

  <!-- ✗ BAD -->
  <my-component />
</template>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/no-restricted-component-names](./no-restricted-component-names.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/restricted-component-names.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/restricted-component-names.js)
