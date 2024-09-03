---
pageClass: rule-details
sidebarDepth: 0
title: vue/max-props
description: enforce maximum number of props in Vue component
since: v9.28.0
---

# vue/max-props

> enforce maximum number of props in Vue component

## :book: Rule Details

This rule enforces a maximum number of props in a Vue SFC, in order to aid in maintainability and reduce complexity.

## :wrench: Options

This rule takes an object, where you can specify the maximum number of props allowed in a Vue SFC.
There is one property that can be specified for the object.

- `maxProps` ... Specify the maximum number of props in the `script` block.

### `{ maxProps: 1 }`

<eslint-code-block :rules="{'vue/max-props': ['error', { maxProps: 1 }]}">

```vue
<!-- ✗ BAD -->
<template>
</template>

<script setup>
defineProps({ 
  prop1: String,
  prop2: String,
})
</script>
```

</eslint-code-block>

### `{ maxProps: 5 }`

<eslint-code-block :rules="{'vue/max-props': ['error', { maxProps: 5 }]}">

```vue
<!-- ✓ GOOD -->
<script>
defineProps({
  prop1: String
})
</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.28.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/max-props.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/max-props.js)
