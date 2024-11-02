---
pageClass: rule-details
sidebarDepth: 0
title: vue/prefer-use-template-ref
description: require using `useTemplateRef` instead of `ref` for template refs
---

# vue/prefer-use-template-ref

> require using `useTemplateRef` instead of `ref` for template refs

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

Vue 3.5 introduced a new way of obtaining template refs via
the [`useTemplateRef()`](https://vuejs.org/guide/essentials/template-refs.html#accessing-the-refs) API.

This rule enforces using the new `useTemplateRef` function instead of `ref` for template refs.

<eslint-code-block :rules="{'vue/prefer-use-template-ref': ['error']}">

```vue
<template>
  <button ref="submitRef">Submit</button>
  <button ref="closeRef">Close</button>
</template>

<script setup>
  import { ref, useTemplateRef } from 'vue';

  /* ✓ GOOD */
  const submitRef = useTemplateRef('submitRef');
  const submitButton = useTemplateRef('submitRef');
  const closeButton = useTemplateRef('closeRef');

  /* ✗ BAD */
  const closeRef = ref();
</script>
```

</eslint-code-block>

This rule skips `ref` template function refs as these should be used to allow custom implementation of storing `ref`. If you prefer
`useTemplateRef`, you have to change the value of the template `ref` to a string. 

<eslint-code-block :rules="{'vue/prefer-use-template-ref': ['error']}">

```vue
<template>
  <button :ref="ref => button = ref">Content</button>
</template>

<script setup>
  import { ref } from 'vue';
  
  /* ✓ GOOD */
  const button = ref();
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/prefer-use-template-ref.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/prefer-use-template-ref.js)
