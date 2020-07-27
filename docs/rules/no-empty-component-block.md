---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-empty-component-block
description: disallow the `<template>` `<script>` `<style>` block to be empty
---
# vue/no-empty-component-block
> disallow the `<template>` `<script>` `<style>` block to be empty

## :book: Rule Details

This rule disallows the `<template>` `<script>` `<style>` block to be empty.

This rule also checks block what has attribute `src`.
See: https://vue-loader.vuejs.org/spec.html#src-imports

<eslint-code-block :rules="{'vue/no-empty-component-block': ['error']}">

```vue
<!-- ✓ GOOD -->
<template>
  <p>foo</p>
</template>

<script>
  console.log('foo')
</script>

<style>
  p {
    display: inline;
  }
</style>

<template src="./template.html"></template>
<template src="./template.html" />

<script src="./script.js"></script>
<script src="./script.js" />

<style src="./style.css"></style>
<style src="./style.css" />


<!-- ✗ BAD -->
<template></template>
<template />
<template src="" />

<script></script>
<script />
<script src="" />

<style></style>
<style />
<style src="" />
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-empty-component-block.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-empty-component-block.js)
