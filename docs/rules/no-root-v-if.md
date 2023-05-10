---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-root-v-if
description: disallow `v-if` directives on root element
---

# vue/no-root-v-if

> disallow `v-if` directives on root element

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

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

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-root-v-if.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-root-v-if.js)
