---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-undef-components-in-script-setup
description: disallow undefined components in `<template>` with `<script setup>`
---
# vue/no-undef-components-in-script-setup

> disallow undefined components in `<template>` with `<script setup>`

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule warns that the component used in the `<template>` is not defined in `<script setup>`.  

Undefined components in `<script setup>` will be resolved from the components registered in the global. However, if you are not using global components, you can use this rule to prevent run-time errors.

<eslint-code-block :rules="{'vue/no-undef-components-in-script-setup': ['error']}">

```vue
<script setup>
import Foo from './Foo.vue'
</script>

<template>
  <!-- ✓ GOOD -->
  <Foo />

  <!-- ✗ BAD -->
  <Bar />
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-undef-components-in-script-setup": ["error", {
    "ignorePatterns": []
  }]
}
```

- `ignorePatterns` Suppresses all errors if component name matches one or more patterns.

### `ignorePatterns: ['custom(\\-\\w+)+']`

<eslint-code-block :rules="{'vue/no-undef-components-in-script-setup': ['error', { 'ignorePatterns': ['custom(\\-\\w+)+'] }]}">

```vue
<script setup>
</script>

<template>
  <!-- ✓ GOOD -->
  <CustomComponent />

  <!-- ✗ BAD -->
  <Bar />
</template>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/no-unregistered-components](./no-unregistered-components.md)
- [vue/no-undef-properties](./no-undef-properties.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-undef-components-in-script-setup.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-undef-components-in-script-setup.js)
