---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deep-mutating-computed-ref
description: disallow mutating nested properties of computed refs whose getter returns a new object
---

# vue/no-deep-mutating-computed-ref

> disallow mutating nested properties of computed refs whose getter returns a new object

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule reports mutations of properties of a computed ref whose getter returns a new object or array literal, e.g. `language.value.selected = 'German'`.

Such a mutation only changes the cached object: it does not call the setter of a writable computed, does not trigger any update, and is lost the next time the getter runs. Assign a whole new value to `.value` instead, so that the setter is called.

Getters that return an existing object, e.g. `computed(() => store.user)`, are not reported, because the mutation changes that object.

<eslint-code-block :rules="{'vue/no-deep-mutating-computed-ref': ['error']}">

```vue
<script setup>
import { ref, computed } from 'vue'

const value = ref('French')
const language = computed({
  get: () => ({ selected: value.value }),
  set: ({ selected }) => {
    value.value = selected
  }
})

/* ✓ GOOD */
language.value = { selected: 'English' }

/* ✗ BAD */
language.value.selected = 'German'
</script>

<template>
  <!-- ✗ BAD -->
  <input v-model="language.selected" />
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Guide - Computed Properties / Writable Computed](https://vuejs.org/guide/essentials/computed.html#writable-computed)
- [Guide - Computed Properties / Avoid mutating computed value](https://vuejs.org/guide/essentials/computed.html#avoid-mutating-computed-value)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deep-mutating-computed-ref.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deep-mutating-computed-ref.test.ts)
