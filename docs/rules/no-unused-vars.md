---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-unused-vars
description: disallow unused variable definitions of v-for directives or scope attributes
---
# vue/no-unused-vars
> disallow unused variable definitions of v-for directives or scope attributes

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule report variable definitions of v-for directives or scope attributes if those are not used.

<eslint-code-block :rules="{'vue/no-unused-vars': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <ol v-for="i in 5">
    <li>{{ i }}</li>
  </ol>

  <!-- ✗ BAD -->
  <ol v-for="i in 5">
    <li>item</li>
  </ol>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-unused-vars.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-unused-vars.js)
