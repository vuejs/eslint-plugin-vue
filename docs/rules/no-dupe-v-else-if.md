---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-dupe-v-else-if
description: disallow duplicate conditions in `v-if` / `v-else-if` chains
---
# vue/no-dupe-v-else-if
> disallow duplicate conditions in `v-if` / `v-else-if` chains

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule disallows duplicate conditions in the same `v-if` / `v-else-if` chain.

<eslint-code-block :rules="{'vue/no-dupe-v-else-if': ['error']}">

```vue
<template>
  <!-- ✗ BAD -->
  <div v-if="isSomething(x)" />
  <div v-else-if="isSomething(x)" />

  <div v-if="a" />
  <div v-else-if="b" />
  <div v-else-if="c && d" />
  <div v-else-if="c && d" />

  <div v-if="n === 1" />
  <div v-else-if="n === 2" />
  <div v-else-if="n === 3" />
  <div v-else-if="n === 2" />
  <div v-else-if="n === 5" />

  <!-- ✓ GOOD -->
  <div v-if="isSomething(x)" />
  <div v-else-if="isSomethingElse(x)" />

  <div v-if="a" />
  <div v-else-if="b" />
  <div v-else-if="c && d" />
  <div v-else-if="c && e" />

  <div v-if="n === 1" />
  <div v-else-if="n === 2" />
  <div v-else-if="n === 3" />
  <div v-else-if="n === 4" />
  <div v-else-if="n === 5" />
</template>
```

</eslint-code-block>

This rule can also detect some cases where the conditions are not identical, but the branch can never execute due to the logic of `||` and `&&` operators.

<eslint-code-block :rules="{'vue/no-dupe-v-else-if': ['error']}">

```vue
<template>
  <!-- ✗ BAD -->
  <div v-if="a || b" />
  <div v-else-if="a" />

  <div v-if="a" />
  <div v-else-if="b" />
  <div v-else-if="a || b" />

  <div v-if="a" />
  <div v-else-if="a && b" />

  <div v-if="a && b" />
  <div v-else-if="a && b && c" />

  <div v-if="a || b" />
  <div v-else-if="b && c" />

  <div v-if="a" />
  <div v-else-if="b && c" />
  <div v-else-if="d && (c && e && b || a)" />
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [no-dupe-else-if]

[no-dupe-else-if]: https://eslint.org/docs/rules/no-dupe-else-if

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-dupe-v-else-if.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-dupe-v-else-if.js)
