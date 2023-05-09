---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-root-v-if
description: enforce valid `v-if` directives on root element
---
# vue/no-root-v-if

> enforce valid `v-if` directives on root element

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

This rule checks whether every template root is valid.

## :book: Rule Details

This rule reports the template root in the following cases:

<eslint-code-block :rules="{'vue/no-root-v-if': ['error']}">

```vue
<!--  `v-if` should not be used on root element without `v-else` -->
<template>
  <div v-if="foo"></div>
</template>

<template><custom-component v-if="shouldShow" /></template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-root-v-if.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-root-v-if.js)
