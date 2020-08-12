---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-mustache
description: disallow usage of mustache interpolations
---
# vue/no-mustache
> disallow usage of mustache interpolations

## :book: Rule Details

This rule disallows the usage of mustache (`{{` and `}}`) interpolation.
The benefit of this is to provide a consistent way to write out strings (using `v-{text,html}`) or if you are using another server-side template language that uses braces as well.

<eslint-code-block fix :rules="{'vue/no-mustache': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-text="text"></div>
  <div v-html="text"></div>
  <div v-bind:data-label="text"></div>
  <div v-bind:data-label="'text'"></div>

  <!-- ✗ BAD -->
  <div>{{ text }}</div>
  <div data-label="{{ text }}"></div>
  <div data-label="{{ 'text' }}"></div>
</template>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/no-bare-strings-in-template](./no-bare-strings-in-template.md)
- [vue/no-useless-mustaches](./no-useless-mustaches.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-mustache.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-mustache.js)
