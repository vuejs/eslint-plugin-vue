---
pageClass: rule-details
sidebarDepth: 0
title: vue/prefer-use-template-ref
description: require using `useTemplateRef` instead of `ref`/`shallowRef` for template refs
since: v9.31.0
---

# vue/prefer-use-template-ref

> require using `useTemplateRef` instead of `ref`/`shallowRef` for template refs

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

Vue 3.5 introduced a new way of obtaining template refs via
the [`useTemplateRef()`](https://vuejs.org/guide/essentials/template-refs.html#accessing-the-refs) API.

This rule enforces using the new `useTemplateRef` function instead of `ref`/`shallowRef` for template refs.

<eslint-code-block fix :rules="{'vue/prefer-use-template-ref': ['error']}">

```vue
<template>
  <button ref="submitRef">Submit</button>
  <button ref="cancelRef">Cancel</button>
  <button ref="closeRef">Close</button>
</template>

<script setup>
  import { ref, shallowRef, useTemplateRef } from 'vue';

  /* ✓ GOOD */
  const submitRef = useTemplateRef('submitRef');
  const submitButton = useTemplateRef('submitRef');
  const closeButton = useTemplateRef('closeRef');

  /* ✗ BAD */
  const closeRef = ref();
  const cancelRef = shallowRef();
</script>
```

</eslint-code-block>

This rule skips `ref` template function refs as these should be used to allow custom implementation of storing `ref`. If you prefer
`useTemplateRef`, you have to change the value of the template `ref` to a string.

<eslint-code-block fix :rules="{'vue/prefer-use-template-ref': ['error']}">

```vue
<template>
  <button :ref="ref => submitRef = ref">Submit</button>
  <button :ref="ref => cancelRef = ref">Cancel</button>
</template>

<script setup>
  import { ref, shallowRef } from 'vue';
  
  /* ✓ GOOD */
  const submitRef = ref();
  const cancelRef = shallowRef();
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.31.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/prefer-use-template-ref.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/prefer-use-template-ref.js)
