---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-define-model-default
description: disallow default values in `defineModel`
---

# vue/no-define-model-default

> disallow default values in `defineModel`

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule disallows the `default` option in `defineModel()`.

When the parent passes `undefined` through `v-model`, for example from a ref that has no initial value, the child falls back to the default while the parent still holds `undefined`, so the two values are out of sync. Leaving out the default and initializing the value in the parent avoids that.

<eslint-code-block :rules="{'vue/no-define-model-default': ['error']}">

```vue
<script setup lang="ts">
/* ✓ GOOD */
const modelValue = defineModel<string>()
const count = defineModel<number>('count', { required: true })

/* ✗ BAD */
const title = defineModel<string>('title', { default: '' })
const items = defineModel<string[]>('items', { default: () => [] })
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Guide - Component v-model / Under the Hood](https://vuejs.org/guide/components/v-model.html#under-the-hood)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-define-model-default.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-define-model-default.test.ts)
