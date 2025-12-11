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

This rule reports directives that are used in the `<template>`, but that are not registered in the `<script setup>` or the Options API's `directives` section.

Undefined directives will be resolved from globally registered directives. However, if you are not using global directives, you can use this rule to prevent runtime errors.

<eslint-code-block :rules="{'vue/no-undef-directives': ['error']}">

```vue
<script setup>
import vFocus from './vFocus';
</script>

<template>
  <!-- ✓ GOOD -->
  <input v-focus>

  <!-- ✗ BAD -->
  <div v-foo></div>
</template>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-undef-directives': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <input v-focus>

  <!-- ✗ BAD -->
  <div v-foo></div>
</template>

<script>
import vFocus from './vFocus';

export default {
  directives: {
    focus: vFocus
  }
}
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

### `"ignorePatterns": ["foo"]`

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
