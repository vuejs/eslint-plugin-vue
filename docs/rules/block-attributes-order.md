---
pageClass: rule-details
sidebarDepth: 0
title: vue/block-attributes-order
description: enforce order of block attributes
since: v4.3.0
---
# vue/block-attributes-order

> enforce order of block attributes

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule aims to enforce ordering of block attributes.

### The default order

```json
[
  {
    "element": "style",
    "order": [
      "module",
      "scoped",
      "lang",
      "src"
    ]
  },
  {
    "element": "script",
    "order": [
      "setup",
      "lang",
      "src"
    ]
  },
  {
    "element": "template",
    "order": [
      "functional",
      "lang",
      "src"
    ]
  }
]
```

<eslint-code-block fix :rules="{'vue/block-attributes-order': ['error']}">

```vue
<template functional lang="pug" src="./template.pug"></template>
<script setup lang="ts" src="./script.ts"></script>
<style module scoped lang="css" src="./style.css"></style>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/block-attributes-order': ['error']}">

```vue
<template src="./template.pug" functional lang="pug"></template>
<script src="./script.ts" lang="ts" setup></script>
<style src="./style.css" lang="css" scoped module></style>
```

</eslint-code-block>

### Custom orders

<eslint-code-block fix :rules="{'vue/block-attributes-order': [
  'error',
  [
    {
      element: 'template',
      order: ['src', 'lang', 'functional']
    },
    {
      element: 'script[setup]',
      order: ['setup', 'src|foo', 'lang']
    },
    {
      element: 'script',
      order: ['src', 'lang', 'setup']
    },
    {
      element: 'style',
      order: [['src', 'scoped'], 'module', 'lang']
    }
  ]
]}">

```vue
<template functional lang="pug" src="./template.pug"></template>
<script src="./script.ts" lang="ts"></script>
<script src="./script.ts" lang="ts" setup foo></script>
<style src="./style.css" scoped module lang="css"></style>
```

</eslint-code-block>

### Custom blocks

<eslint-code-block fix :rules="{'vue/block-attributes-order': [
  'error',
  [
    {
      element: 'foobarbaz',
      order: ['foo', 'bar', 'baz']
    }
  ]
]}">

```vue
<foobarbaz foo bar baz></foobarbaz>
<foobarbaz baz bar foo></foobarbaz>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v4.3.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/block-attributes-order.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/block-attributes-order.js)
