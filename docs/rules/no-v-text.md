---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-v-text
description: disallow use of v-text
---
# vue/no-v-text

> disallow use of v-text

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule reports all uses of `v-text` directive.

<eslint-code-block :rules="{'vue/no-v-text': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div>{{ foobar }}</div>

  <!-- ✗ BAD -->
  <div v-text="foobar"></div>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-v-text.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-v-text.js)
