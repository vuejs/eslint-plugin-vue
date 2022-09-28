---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-prop-comment
description: require prop should have a comment
---
# vue/require-prop-comment

> require prop should have a comment

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule requires that the prop should have a comment

<eslint-code-block :rules="{'vue/require-prop-comment': ['error']}">

```vue
<!-- ✓ GOOD -->
<template>
  <div>1</div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    /**
     * a comment
     */
    a: Number,
    // b comment
    b: Number,
    // c
    // comment
    c: Number
  }
})
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/require-prop-comment': ['error']}">

```vue
<!-- ✗ BAD -->
<template>
  <div>1</div>
</template>
<script setup>
const props = defineProps({
  a: Number
})
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-prop-comment.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-prop-comment.js)
