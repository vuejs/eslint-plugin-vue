---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-explicit-slots
description: require slots to be explicitly defined with defineSlots
---

# vue/require-explicit-slots

> require slots to be explicitly defined

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule enforces all slots used in the template to be defined once either in the `script setup` block with the [`defineSlots`](https://vuejs.org/api/sfc-script-setup.html) macro, or with the [`slots property`](https://vuejs.org/api/options-rendering.html#slots) in the Options API.

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
