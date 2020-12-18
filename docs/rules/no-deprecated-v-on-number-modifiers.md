---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-v-on-number-modifiers
description: disallow using deprecated number (keycode) modifiers (in Vue.js 3.0.0+)
---
# vue/no-deprecated-v-on-number-modifiers
> disallow using deprecated number (keycode) modifiers (in Vue.js 3.0.0+)

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports use of deprecated `KeyboardEvent.keyCode` modifier on `v-on` directive (in Vue.js 3.0.0+)

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

- [Vue RFCs - 0014-drop-keycode-support](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0014-drop-keycode-support.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-v-on-number-modifiers.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-v-on-number-modifiers.js)
