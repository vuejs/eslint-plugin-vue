---
pageClass: rule-details
sidebarDepth: 0
title: vue/prefer-use-template-ref
description: require using `useTemplateRef` over `ref` for template refs
---

# vue/prefer-use-template-ref

> require using `useTemplateRef` over `ref` for template refs

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

Vue 3.5 introduced a new way of obtaining template refs via
the [`useTemplateRef()`](https://vuejs.org/guide/essentials/template-refs.html#accessing-the-refs) API.

This rule enforces using the new `useTemplateRef` function over `ref` for template refs.

<eslint-code-block fix :rules="{'vue/prefer-use-template-ref': ['error']}">

```vue

<template>
  <div ref="divRef"></div>
  <button ref="submitter">Submit</button>
</template>

<script>
  import { ref, useTemplateRef } from 'vue';

  /* ✓ GOOD */
  const divRef = useTemplateRef('divRef');
  const div = useTemplateRef('divRef');
  const loremIpsum = useTemplateRef('divRef');
  const submitButton = useTemplateRef('submitter');
  /* ✗ BAD */
  const divRef = ref();
  const submitter = ref();
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/prefer-use-template-ref.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/prefer-use-template-ref.js)
