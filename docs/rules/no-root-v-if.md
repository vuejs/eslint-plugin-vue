---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-root-v-if
description: disallow `v-if` directives on root element
since: v9.12.0
---
# vue/no-root-v-if

> disallow `v-if` directives on root element

This rule reports template roots with `v-if`. Rendering of the whole component could be made conditional in the parent component (with a `v-if` there) instead.

## :book: Rule Details

This rule reports the template root in the following cases:

<eslint-code-block :rules="{'vue/no-root-v-if': ['error']}">

```vue
<template>
  <div v-if="foo"></div>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.12.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-root-v-if.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-root-v-if.js)
