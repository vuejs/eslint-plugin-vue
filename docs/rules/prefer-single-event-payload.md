---
pageClass: rule-details
sidebarDepth: 0
title: vue/prefer-single-event-payload
description: enforce passing a single argument to custom event emissions
since: v10.9.0
---

# vue/prefer-single-event-payload

> enforce passing a single argument to custom event emissions

## :book: Rule Details

This rule reports when a custom event is emitted or declared with more than one payload argument. When handling an event inline (e.g., `@update="handler"`), the handler only receives the **first** payload argument. Passing multiple arguments is therefore error-prone and hard to consume. Wrapping all values in a single object makes the intent explicit and ensures all data is available to every type of handler.

The rule checks both emit **calls** and emit **declarations** (Options API `emits` and `defineEmits`).

<eslint-code-block :rules="{'vue/prefer-single-event-payload': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button @click="$emit('update', { value, extra })" />
  <!-- ✗ BAD -->
  <button @click="$emit('update', value, extra)" />
</template>

<script>
export default {
  emits: {
    // ✓ GOOD
    change: (payload) => payload != null,
    // ✗ BAD
    update: (value, extra) => value != null,
  },
  methods: {
    handleClick() {
      // ✓ GOOD
      this.$emit('change', { value, extra })
      // ✗ BAD
      this.$emit('update', value, extra)
    }
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/prefer-single-event-payload': ['error']}">

```vue
<script setup>
const emit = defineEmits(['change'])

// ✓ GOOD
emit('change', { value1, value2 })
// ✗ BAD
emit('change', value1, value2)
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/prefer-single-event-payload': ['error']}">

```vue
<script setup lang="ts">
const emit = defineEmits<{
  // ✓ GOOD
  change: [payload: { value: string; extra: number }]
  // ✗ BAD
  update: [value: string, extra: number]
}>()
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/require-explicit-emits](./require-explicit-emits.md)
- [vue/v-on-handler-style](./v-on-handler-style.md)

## :books: Further Reading

- [Vue.js - Component Events](https://vuejs.org/guide/components/events.html)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v10.9.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/prefer-single-event-payload.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/prefer-single-event-payload.test.ts)
