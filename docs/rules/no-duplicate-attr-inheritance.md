---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-duplicate-attr-inheritance
description: enforce `inheritAttrs` to be set to `false` when using `v-bind="$attrs"`
---
# vue/no-duplicate-attr-inheritance
> enforce `inheritAttrs` to be set to `false` when using `v-bind="$attrs"`

## :book: Rule Details

This rule aims to prevent duplicated attribute inheritance.  
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

### Options

Nothing.

## Further Reading

- [API - inheritAttrs](https://vuejs.org/v2/api/index.html#inheritAttrs)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-duplicate-attr-inheritance.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-duplicate-attr-inheritance.js)
