---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-html-element-is
description: disallow using deprecated the `is` attribute on HTML elements (in Vue.js 3.0.0+)
---
# vue/no-deprecated-html-element-is
> disallow using deprecated the `is` attribute on HTML elements (in Vue.js 3.0.0+)

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.

## :book: Rule Details

This rule reports deprecated the `is` attribute on HTML elements (removed in Vue.js v3.0.0+)

<eslint-code-block :rules="{'vue/no-deprecated-html-element-is': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div />
  <component is="foo">

  <!-- ✗ BAD -->
  <div is="foo" />
  <div :is="foo" />
</template>
```

</eslint-code-block>

### :wrench: Options

Nothing.

## :books: Further Reading

- [Vue RFCs - 0027-custom-elements-interop](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0027-custom-elements-interop.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-html-element-is.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-html-element-is.js)
