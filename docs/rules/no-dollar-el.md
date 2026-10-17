---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-dollar-el
description: disallow using `$el`
---

# vue/no-dollar-el

> disallow using `$el`

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule reports uses of the `$el` component instance property, both on the current instance (`$el`, `this.$el`) and on other instances (`this.$refs.modal.$el`).

`$el` only points to the root DOM element while the component has a single root element. Once a component renders multiple root nodes, `$el` points to a placeholder text node instead, so code like `$el.querySelector(...)` silently breaks. Use [template refs](https://vuejs.org/guide/essentials/template-refs.html) to access DOM elements instead.

<eslint-code-block :rules="{'vue/no-dollar-el': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <input ref="input" />
  <button @click="$refs.input.focus()">Focus</button>

  <!-- ✗ BAD -->
  <button @click="$el.querySelector('input').focus()">Focus</button>
  <button @click="$refs.modal.$el.focus()">Focus</button>
</template>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-dollar-el': ['error']}">

```vue
<script>
export default {
  mounted() {
    /* ✓ GOOD */
    this.$refs.input.focus()

    /* ✗ BAD */
    this.$el.querySelector('input').focus()
    this.$refs.modal.$el.focus()
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-dollar-el': ['error']}">

```vue
<script setup>
import { onMounted, useTemplateRef } from 'vue'

const input = useTemplateRef('input')
const modal = useTemplateRef('modal')

onMounted(() => {
  /* ✓ GOOD */
  input.value.focus()

  /* ✗ BAD */
  modal.value.$el.focus()
})
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [API - $el](https://vuejs.org/api/component-instance.html#el)
- [Guide - Template Refs](https://vuejs.org/guide/essentials/template-refs.html)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-dollar-el.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-dollar-el.test.ts)
