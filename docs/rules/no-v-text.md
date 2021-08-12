---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-v-text
description: disallow use of v-text
since: v7.17.0
---
# vue/no-v-text

> disallow use of v-text

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

  - However, when using selfClose to element with v-text like `<div v-text="foobar" />`, it can't be fixed.

## :book: Rule Details

This rule reports all uses of `v-text` directive.


<eslint-code-block fix :rules="{'vue/no-v-text': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div>{{ foobar }}</div>

  <!-- ✗ BAD -->
  <div v-text="foobar"></div>
  <!-- Reported. However, Not fixable -->
  <div v-text="foobar" />
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.17.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-v-text.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-v-text.js)
