---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-explicit-slots
description: require slots to be explicitly defined
since: v9.21.0
---

# vue/require-explicit-slots

> require slots to be explicitly defined

## :book: Rule Details

This rule enforces all slots used in the template to be defined once either in the `script setup` block with the [`defineSlots`](https://vuejs.org/api/sfc-script-setup.html#defineslots) macro, or with the [`slots property`](https://vuejs.org/api/options-rendering.html#slots) in the Options API.

<eslint-code-block :rules="{'vue/require-explicit-slots': ['error']}">

```vue
<template>
  <div>
    <!-- ✓ GOOD -->
    <slot />
    <slot name="foo" />
    <!-- ✗ BAD -->
    <slot name="bar" />
  </div>
</template>
<script setup lang="ts">
defineSlots<{
  default(props: { msg: string }): any
  foo(props: { msg: string }): any
}>()
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/require-explicit-slots': ['error']}">

```vue
<template>
  <div>
    <!-- ✓ GOOD -->
    <slot />
    <slot name="foo" />
    <!-- ✗ BAD -->
    <slot name="bar" />
  </div>
</template>
<script lang="ts">
import { SlotsType } from 'vue'

defineComponent({
  slots: Object as SlotsType<{
    default: { msg: string }
    foo: { msg: string }
  }>
})
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.21.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-explicit-slots.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-explicit-slots.js)
