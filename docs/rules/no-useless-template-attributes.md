---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-useless-template-attributes
description: disallow useless attribute on `<template>`
since: v7.19.0
---
# vue/no-useless-template-attributes

> disallow useless attribute on `<template>`

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule to prevent any useless attribute on `<template>` tags.

<eslint-code-block :rules="{'vue/no-useless-template-attributes': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <template v-if="foo">...</template>
  <template v-if="foo">...</template>
  <template v-else-if="foo">...</template>
  <template v-else>...</template>
  <template v-for="i in foo" :key="i">...</template>
  <template v-slot:foo>...</template>
  <!-- for Vue<=2.5 -->
  <template slot="foo">...</template>
  <template :slot="foo">...</template>
  <template slot-scope="param">...</template>
  <!-- for Vue<=2.4 -->
  <template scope="param">...</template>

  <!-- ✗ BAD -->
  <template v-if="foo" class="heading">...</template>
  <template v-for="i in foo" :bar="i">...</template>
  <template v-slot:foo="foo" ref="input">...</template>
  <template v-if="foo" @click="click">...</template>

  <!-- Ignore -->
  <template class="heading">...</template>
  <template :bar="i">...</template>
  <template ref="input">...</template>
  <template @click="click">...</template>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/no-lone-template]

[vue/no-lone-template]: ./no-lone-template.md

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.19.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-useless-template-attributes.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-useless-template-attributes.js)
