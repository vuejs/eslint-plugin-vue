---
pageClass: rule-details
sidebarDepth: 0
title: vue/this-in-template
description: disallow usage of `this` in template
---
# vue/this-in-template
> disallow usage of `this` in template

- :gear: This rule is included in `"plugin:vue/recommended"`.

## :book: Rule Details

This rule aims at preventing usage of `this` in Vue templates.

<eslint-code-block :rules="{'vue/this-in-template': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <a :href="url">
    {{ text }}
  </a>
  
  <!-- ✗ BAD -->
  <a :href="this.url">
    {{ this.text }}
  </a>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/this-in-template": ["error", "always" | "never"]
}
```
- `"always"` ... Always use `this` while accessing properties from Vue.
- `"never"` (default) ... Never use `this` keyword in expressions.

### `"always"`

<eslint-code-block :rules="{'vue/this-in-template': ['error', 'always']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <a :href="this.url">
    {{ this.text }}
  </a>
  
  <!-- ✗ BAD -->
  <a :href="url">
    {{ text }}
  </a>
</template>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/this-in-template.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/this-in-template.js)
