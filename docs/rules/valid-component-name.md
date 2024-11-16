---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-component-name
description: enforce consistency in component names
---

# vue/valid-component-name

> enforce consistency in component names

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule enforces consistency in component names.

<eslint-code-block :rules="{ 'vue/valid-component-name': ['error'] }">

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
  "vue/valid-component-name": ["error", { 
    "allow": []
  }]
}
```

### `"allow"`

<eslint-code-block :rules="{'vue/valid-component-name': ['error', { 'allow': ['/^custom-/'] }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <custom-component />

  <!-- ✗ BAD -->
  <my-component />
</template>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-component-name.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-component-name.js)
