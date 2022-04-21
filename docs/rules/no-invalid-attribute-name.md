---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-invalid-attribute-name
description: require valid attribute names
---
# vue/no-invalid-attribute-name

> require valid attribute names

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule detects invalid HTML attributes.

<eslint-code-block :rules="{'vue/no-invalid-attribute-name': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <p foo.bar></p>
  <p foo-bar></p>
  <p _foo.bar></p>
  <p :foo-bar></p>

  <!-- ✗ BAD -->
  <p 0abc></p>
  <p -def></p>
  <p !ghi></p>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-invalid-attribute-name.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-invalid-attribute-name.js)
