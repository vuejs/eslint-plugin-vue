---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-duplicate-attr-inheritance
description: enforce `inheritAttrs` to be set to `false` when using `v-bind="$attrs"`
since: v7.0.0
---
# vue/no-duplicate-attr-inheritance

> enforce `inheritAttrs` to be set to `false` when using `v-bind="$attrs"`

## :book: Rule Details

This rule aims to prevent duplicate attribute inheritance.  
This rule to warn to apply `inheritAttrs: false` when it detects `v-bind="$attrs"` being used.

<eslint-code-block :rules="{'vue/no-duplicate-attr-inheritance': ['error']}">

```vue
<template>
  <MyInput v-bind="$attrs" />
</template>
<script>
export default {
  /* ✓ GOOD */
  inheritAttrs: false
}
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-duplicate-attr-inheritance': ['error']}">

```vue
<template>
  <MyInput v-bind="$attrs" />
</template>
<script>
export default {
  /* ✗ BAD */
  // inheritAttrs: true (default)
}
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [API - inheritAttrs](https://vuejs.org/api/options-misc.html#inheritattrs)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-duplicate-attr-inheritance.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-duplicate-attr-inheritance.js)
