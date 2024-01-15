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
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/require-explicit-slots': ['error']}">

```vue
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
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/require-explicit-slots': ['error']}">

```vue
<!-- ✓ GOOD -->
<template>
  <div>
    <slot name="foo" />
  </div>
</template>
<script lang="ts">
import { SlotsType } from 'vue'
defineComponent({
  slots: Object as SlotsType<{
    foo: { msg: string }
  }>
})
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/require-explicit-slots': ['error']}">

```vue
<!-- ✗ BAD -->
<template>
  <div>
    <slot />
  </div>
</template>
<script setup lang="ts"></script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/require-explicit-slots': ['error']}">

```vue
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
