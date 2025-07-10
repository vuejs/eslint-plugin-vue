---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-negated-condition
description: disallow negated conditions in v-if/v-else
---

# vue/no-negated-condition

> disallow negated conditions in v-if/v-else

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule disallows negated conditions in `v-if` and `v-else-if` directives which have an `v-else` branch.

Negated conditions make the code less readable. When there's an `else` clause, it's better to use a positive condition and switch the branches.

<eslint-code-block :rules="{'vue/no-negated-condition': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-if="foo" />
  <div v-else />

  <div v-if="!foo" />
  <div v-else-if="bar" />

  <div v-if="!foo" />

  <div v-if="a !== b" />

  <!-- ✗ BAD -->
  <div v-if="!foo" />
  <div v-else />

  <div v-if="a !== b" />
  <div v-else />

  <div v-if="foo" />
  <div v-else-if="!bar" />
  <div v-else />
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [no-negated-condition](https://eslint.org/docs/rules/no-negated-condition)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-negated-condition.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-negated-condition.js)
