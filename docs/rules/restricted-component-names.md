---
pageClass: rule-details
sidebarDepth: 0
title: vue/restricted-component-names
description: enforce using only specific component names
since: v9.32.0
---

# vue/restricted-component-names

> enforce using only specific component names

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

### `"allow: ['/^custom-/']"`

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

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.32.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/restricted-component-names.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/restricted-component-names.js)
