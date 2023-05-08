---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-v-if-template-root
description: enforce valid `v-if` directives on root element
---
# vue/valid-v-if-template-root

> enforce valid `v-if` directives on root element

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every template root is valid.

## :book: Rule Details

This rule reports the template root in the following cases:

<eslint-code-block :rules="{'vue/valid-v-if-template-root': ['error']}">

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

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-v-if-template-root.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-v-if-template-root.js)
