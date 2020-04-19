---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-shorthand-boolean-prop
description: enforce or forbid passing `true` value to a prop
---
# vue/require-shorthand-boolean-prop
> enforce or forbid passing `true` value to a prop

## :book: Rule Details

This rule aims at enforcing usage of shorthand properties for `true` values in Vue templates.

<eslint-code-block :rules="{'vue/require-shorthand-boolean-prop': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <component
    isValid
  />
  
  <!-- ✗ BAD -->
  <component
    :isValid="true"
  />
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/require-shorthand-boolean-prop": ["error", "always" | "never"]
}
```
- `"always"` (default) ... Always use shorthand prop.
- `"never"` ... Never use shorthand prop. Instead pass `true` explicitly.

### `"never"`

<eslint-code-block :rules="{'vue/require-shorthand-boolean-prop': ['error', 'never']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <component
    :isValid="true"
    isValid
  />
  
  <!-- ✗ BAD -->
  <component
    isValid
  />
</template>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-shorthand-boolean-prop.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-shorthand-boolean-prop.js)
