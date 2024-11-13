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

<eslint-code-block :rules="{'vue/no-duplicate-attr-inheritance': ['error', { checkMultiRootNodes: false }]}">

```vue
<template>
  <MyInput v-bind="$attrs" />
</template>
<script>
export default {
  /* ✓ GOOD */
  inheritAttrs: false
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-duplicate-attr-inheritance': ['error', { checkMultiRootNodes: false }]}">

```vue
<template>
  <MyInput v-bind="$attrs" />
</template>
<script>
export default {
  /* ✗ BAD */
  // inheritAttrs: true (default)
}
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-duplicate-attr-inheritance": ["error", {
    "checkMultiRootNodes": false,
  }]
}
```

- `"checkMultiRootNodes"`: If set to `true`, check and warn to apply `inheritAttrs: false` whenever it detects `v-bind="$attrs"` being used. Default is `false`, will ignore the components with multiple root nodes, because Vue encourages adding `v-bind="$attrs"` in this case to prevent runtime warnings. See [attribute inheritance on multiple root nodes](https://vuejs.org/guide/components/attrs.html#attribute-inheritance-on-multiple-root-nodes) for more.

### `"checkMultiRootNodes": true`

<eslint-code-block :rules="{'vue/no-duplicate-attr-inheritance': ['error', { checkMultiRootNodes: true }]}">

```vue
<template>
  <div v-bind="$attrs" />
  <div />
</template>
<script>
export default {
  /* ✗ BAD */
  // inheritAttrs: true (default)
}
</script>
```

</eslint-code-block>

## :books: Further Reading

- [API - inheritAttrs](https://vuejs.org/api/options-misc.html#inheritattrs)
- [Fallthrough Attributes](https://vuejs.org/guide/components/attrs.html#attribute-inheritance-on-multiple-root-nodes)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-duplicate-attr-inheritance.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-duplicate-attr-inheritance.js)
