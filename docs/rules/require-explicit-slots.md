---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-explicit-slots
description: require slots to be explicitly defined with defineSlots
---

# vue/require-explicit-slots

> require slots to be explicitly defined with defineSlots

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule enforces all slots used in the template to be defined once
in the `script setup` block with the [`defineSlots`](https://vuejs.org/api/sfc-script-setup.html) macro.

<eslint-code-block :rules="{'vue/require-explicit-slots': ['error']}">

```vue
<!-- ✓ GOOD -->
<template>
  <div>
    <slot />
  </div>
</template>
<script setup lang="ts">
defineSlots<{
  default(props: { msg: string }): any
}>()
</script>

<!-- ✓ GOOD -->
<template>
  <div>
    <slot name="foo" />
  </div>
</template>
<script setup lang="ts">
defineSlots<{
  foo(props: { msg: string }): any
}>()
</script>

<!-- ✗ BAD -->
<template>
  <div>
    <slot />
  </div>
</template>
<script setup lang="ts"></script>

<!-- ✗ BAD -->
<template>
  <div>
    <slot name="foo" />
  </div>
</template>
<script setup lang="ts">
defineSlots<{
  bar(props: { msg: string }): any
}>()
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.
