---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-negated-v-if-condition
description: disallow negated conditions in v-if/v-else
since: v10.4.0
---

# vue/no-negated-v-if-condition

> disallow negated conditions in v-if/v-else

- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

This rule disallows negated conditions in `v-if` and `v-else-if` directives which have an `v-else` branch.

Negated conditions make the code less readable. When there's an `else` clause, it's better to use a positive condition and switch the branches.

<eslint-code-block :rules="{'vue/no-negated-v-if-condition': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-if="foo">First</div>
  <div v-else>Second</div>

  <div v-if="!foo">First</div>
  <div v-else-if="bar">Second</div>

  <div v-if="!foo">Content</div>

  <div v-if="a !== b">Not equal</div>

  <!-- ✗ BAD -->
  <div v-if="!foo">First</div>
  <div v-else>Second</div>

  <div v-if="a !== b">First</div>
  <div v-else>Second</div>

  <div v-if="foo">First</div>
  <div v-else-if="!bar">Second</div>
  <div v-else>Third</div>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [no-negated-condition](https://eslint.org/docs/latest/rules/no-negated-condition)
- [vue/no-negated-condition](https://eslint.vuejs.org/rules/no-negated-condition.html)
- [unicorn/no-negated-condition](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-negated-condition.md)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v10.4.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-negated-v-if-condition.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-negated-v-if-condition.js)
