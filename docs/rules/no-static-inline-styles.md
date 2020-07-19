---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-static-inline-styles
description: disallow static inline `style` attributes
---
# vue/no-static-inline-styles
> disallow static inline `style` attributes

## :book: Rule Details

This rule reports static inline `style` bindings and `style` attributes.
The styles reported in this rule mean that we recommend separating them into `<style>` tag.

<eslint-code-block :rules="{'vue/no-static-inline-styles': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div :style="styleObject"></div>
  <div :style="{ backgroundImage: 'url('+img+')' }"></div>

  <!-- ✗ BAD -->
  <div style="color: pink;"></div>
  <div :style="{ color: 'pink' }"></div>
  <div :style="[ { color: 'pink' }, { 'font-size': '85%' } ]"></div>
  <div :style="{ backgroundImage, color: 'pink' }"></div>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-static-inline-styles": ["error", {
    "allowBinding": false
  }]
}
```

- allowBinding ... if `true`, allow binding static inline `style`. default `false`.

### `"allowBinding": true`

<eslint-code-block :rules="{'vue/no-static-inline-styles': ['error', {'allowBinding': true}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div :style="{ transform: 'scale(0.5)' }"></div>
  <div :style="[ { transform: 'scale(0.5)' }, { 'user-select': 'none' } ]"></div>

  <!-- ✗ BAD -->
  <div style="transform: scale(0.5);"></div>
</template>
```

</eslint-code-block>

## :books: Further Reading

- [Guide - Class and Style Bindings / Binding Inline Styles](https://v3.vuejs.org/guide/class-and-style.html#binding-inline-styles)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-static-inline-styles.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-static-inline-styles.js)
