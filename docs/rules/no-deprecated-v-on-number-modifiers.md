---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-v-on-number-modifiers
description: disallow using deprecated number (keycode) modifiers (in Vue.js 3.0.0+)
since: v7.0.0
---

# vue/no-deprecated-v-on-number-modifiers

> disallow using deprecated number (keycode) modifiers (in Vue.js 3.0.0+)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `*.configs["flat/essential"]`, `"plugin:vue/strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/recommended"` and `*.configs["flat/recommended"]`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports use of deprecated `KeyboardEvent.keyCode` modifier on `v-on` directive (in Vue.js 3.0.0+).

See [Migration Guide - KeyCode Modifiers](https://v3-migration.vuejs.org/breaking-changes/keycode-modifiers.html) for more details.

<eslint-code-block fix :rules="{'vue/no-deprecated-v-on-number-modifiers': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <input v-on:keyup.page-down="onArrowUp">
  <input @keyup.page-down="onArrowUp">
  <input @keyup.9="onArrowUp"> <!-- 9 is KeyboardEvent.key -->


  <!-- ✗ BAD -->
  <input v-on:keyup.34="onArrowUp">
  <input @keyup.34="onArrowUp">
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/valid-v-on]

[vue/valid-v-on]: ./valid-v-on.md

## :books: Further Reading

- [Migration Guide - KeyCode Modifiers](https://v3-migration.vuejs.org/breaking-changes/keycode-modifiers.html)
- [Vue RFCs - 0014-drop-keycode-support](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0014-drop-keycode-support.md)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-v-on-number-modifiers.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-v-on-number-modifiers.js)
