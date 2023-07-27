---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-use-v-else-with-v-for
description: disallow using `v-else-if`/`v-else` on the same element as `v-for`
---
# vue/no-use-v-else-with-v-for

> disallow using `v-else-if`/`v-else` on the same element as `v-for`

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule reports elements that have both `v-else-if`/`v-else` and `v-for` directives. That is valid in Vue (`v-else-if`/`v-else` will take precedence), but is confusing to read.

<eslint-code-block :rules="{'vue/no-use-v-else-with-v-for': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-if="foo">foo</div>
  <template v-else-if="bar">
    <div v-for="x in xs">{{ x }}</div>
  </template>
  <template v-else>
    <div v-for="x in xs">{{ x }}</div>
  </template>

  <!-- ✗ BAD -->
  <div v-if="foo">foo</div>
  <div v-else-if="bar" v-for="x in xs">{{ x }}</div>
  <div v-else v-for="x in xs">{{ x }}</div>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mute: When Not To Use It

If you don't find using `v-else-if`/`v-else` together with `v-for` confusing to read, you can safely disable this rule.

## :couple: Related Rules

- [vue/no-use-v-if-with-v-for](./no-use-v-if-with-v-for.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-use-v-else-with-v-for.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-use-v-else-with-v-for.js)
