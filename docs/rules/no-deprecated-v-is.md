---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-v-is
description: disallow deprecated `v-is` directive (in Vue.js 3.1.0+)
since: v7.11.0
---
# vue/no-deprecated-v-is

> disallow deprecated `v-is` directive (in Vue.js 3.1.0+)

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports deprecated `v-is` directive in Vue.js v3.1.0+.

Use [`is` attribute with `vue:` prefix](https://vuejs.org/api/built-in-special-attributes.html#is) instead.

<eslint-code-block fix :rules="{'vue/no-deprecated-v-is': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div is="vue:MyComponent" />
  <component is="MyComponent" />
  
  <!-- ✗ BAD -->
  <div v-is="'MyComponent'" />
</template>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/valid-v-is]

[vue/valid-v-is]: ./valid-v-is.md

## :books: Further Reading

- [Migration Guide - Custom Elements Interop](https://v3-migration.vuejs.org/breaking-changes/custom-elements-interop.html#vue-prefix-for-in-dom-template-parsing-workarounds)
- [API - v-is](https://vuejs.org/api/built-in-special-attributes.html#is)
- [API - v-is (Old)](https://github.com/vuejs/docs-next/blob/008613756c3d781128d96b64a2d27f7598f8f548/src/api/directives.md#v-is)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.11.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-v-is.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-v-is.js)
