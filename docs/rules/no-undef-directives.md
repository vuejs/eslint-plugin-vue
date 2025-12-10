---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-undef-directives
description: disallow use of undefined custom directives
---

# vue/no-undef-directives

> disallow use of undefined custom directives

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule reports use of undefined custom directives in `<template>`.

<eslint-code-block :rules="{'vue/no-undef-directives': ['error']}">

```vue
<template>
  <!-- ✗ BAD -->
  <input v-focus>
  <div v-foo></div>
</template>

<script setup>
// vFocus is not imported
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-undef-directives': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <input v-focus>
  <div v-foo></div>
</template>

<script setup>
import vFocus from './vFocus';
const vFoo = {}
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-undef-directives": ["error", {
    "ignorePatterns": ["foo"]
  }]
}
```

- `ignorePatterns` (`string[]`) ... An array of regex pattern strings to ignore.

### `ignorePatterns`

<eslint-code-block :rules="{'vue/no-undef-directives': ['error', {ignorePatterns: ['foo']}]}">

```vue
<template>
  <div v-foo></div>
</template>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-undef-directives.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-undef-directives.js)
