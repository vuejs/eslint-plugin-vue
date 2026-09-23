---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-content-outside-block
description: disallow content outside of the top-level blocks
---

# vue/no-content-outside-block

> disallow content outside of the top-level blocks

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>
- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

This rule reports text content that is placed outside of the top-level blocks of a Single-File Component.

The Vue compiler only processes the top-level blocks (`<template>`, `<script>`, `<style>` and custom blocks) and silently drops everything between them. Code written outside of a block never runs and text written outside of a block is never rendered, so such content is almost always a leftover or a mistake.

HTML comments (`<!-- ... -->`) and custom blocks (such as `<docs>` or `<i18n>`) are not reported, since both are a legitimate part of an SFC.

<eslint-code-block :rules="{'vue/no-content-outside-block': ['error']}">

```vue
<!-- ✓ GOOD -->
<template>
  <div>Hello</div>
</template>

<script>
console.log('this runs')
</script>

<docs>
Custom blocks are not reported.
</docs>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-content-outside-block': ['error']}">

```vue
<!-- ✗ BAD -->
<template>
  <div>Hello</div>
</template>

console.log('this never runs')

<script>
console.log('this runs')
</script>

hello world
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Vue Single-File Component Spec](https://vuejs.org/api/sfc-spec.html)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-content-outside-block.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-content-outside-block.test.ts)
