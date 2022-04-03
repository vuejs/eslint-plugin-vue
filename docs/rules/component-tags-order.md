---
pageClass: rule-details
sidebarDepth: 0
title: vue/component-tags-order
description: enforce order of component top-level elements
since: v6.1.0
---
# vue/component-tags-order

> enforce order of component top-level elements

- :gear: This rule is included in `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule warns about the order of the `<script>`, `<template>` & `<style>` tags.

## :wrench: Options

```json
{
  "vue/component-tags-order": ["error", {
    "order": [ [ "script", "template" ], "style" ]
  }]
}
```

- `order` (`(string|string[])[]`) ... The order of top-level element names. default `[ [ "script", "template" ], "style" ]`.

### `{ "order": [ [ "script", "template" ], "style" ] }` (default)

<eslint-code-block fix :rules="{'vue/component-tags-order': ['error']}">

```vue
<!-- ✓ GOOD -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/component-tags-order': ['error']}">

```vue
<!-- ✓ GOOD -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/component-tags-order': ['error']}">

```vue
<!-- ✗ BAD -->
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

</eslint-code-block>

### `{ "order": ["template", "script", "style"] }`

<eslint-code-block fix :rules="{'vue/component-tags-order': ['error', { 'order': ['template', 'script', 'style'] }]}">

```vue
<!-- ✓ GOOD -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/component-tags-order': ['error', { 'order': ['template', 'script', 'style'] }]}">

```vue
<!-- ✗ BAD -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

</eslint-code-block>

### `{ "order": ["docs", "template", "script", "style"] }`

<eslint-code-block fix :rules="{'vue/component-tags-order': ['error', { 'order': ['docs', 'template', 'script', 'style'] }]}">

```vue
<!-- ✓ GOOD -->
<docs> documentation </docs>
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/component-tags-order': ['error', { 'order': ['docs', 'template', 'script', 'style'] }]}">

```vue
<!-- ✗ BAD -->
<template>...</template>
<script>/* ... */</script>
<docs> documentation </docs>
<style>/* ... */</style>
```

</eslint-code-block>

## :books: Further Reading

- [Style guide - Single-file component top-level element order](https://vuejs.org/style-guide/rules-recommended.html#single-file-component-top-level-element-order)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v6.1.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/component-tags-order.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/component-tags-order.js)
