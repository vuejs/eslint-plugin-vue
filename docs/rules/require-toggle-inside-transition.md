---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-toggle-inside-transition
description: require control the display of the content inside `<transition>`
since: v7.0.0
---

# vue/require-toggle-inside-transition

> require control the display of the content inside `<transition>`

- :gear: This rule is included in all of `"plugin:vue/essential"`, `*.configs["flat/essential"]`, `"plugin:vue/strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/recommended"` and `*.configs["flat/recommended"]`.

## :book: Rule Details

This rule reports elements inside `<transition>` that do not control the display.

<eslint-code-block :rules="{'vue/require-toggle-inside-transition': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <transition><div v-if="show" /></transition>
  <transition><div v-show="show" /></transition>

  <!-- ✗ BAD -->
  <transition><div /></transition>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/require-toggle-inside-transition": ["error", {
    "additionalDirectives": []
  }]
}
```

- `additionalDirectives` (`string[]`) ... Custom directives which will satisfy this rule in addition to `v-show` and `v-if`. Should be added without the `v-` prefix.

### `additionalDirectives: ["dialog"]`

<eslint-code-block :rules="{'vue/require-toggle-inside-transition': ['error', {additionalDirectives: ['dialog']}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <transition><div v-if="show" /></transition>
  <transition><div v-show="show" /></transition>
  <transition><dialog v-dialog="show" /></transition>

  <!-- ✗ BAD -->
  <transition><div /></transition>
  <transition><div v-custom="show" /></transition>
<template>
```

</eslint-code-block>

## :books: Further Reading

- [Vue RFCs - 0017-transition-as-root](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0017-transition-as-root.md)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-toggle-inside-transition.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-toggle-inside-transition.js)
