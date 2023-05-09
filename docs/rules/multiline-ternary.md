---
pageClass: rule-details
sidebarDepth: 0
title: vue/multiline-ternary
description: Enforce newlines between operands of ternary expressions in `<template>`
since: v9.7.0
---
# vue/multiline-ternary

> Enforce newlines between operands of ternary expressions in `<template>`

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule is the same rule as core [multiline-ternary] rule but it applies to the expressions in `<template>` and `<style>`.

## :book: Rule Details

<eslint-code-block fix :rules="{'vue/multiline-ternary': ['error']}">

```vue
<template>
  <div>
    <!-- ✓ GOOD -->
    <div :class="isEnabled
      ? 'check'
      : 'stop'" />

    <!-- ✗ BAD -->
    <div :class="isEnabled ? 'check' : 'stop'" />
  </div>
</template>

<style>
div {
  /* ✓ GOOD */
  color: v-bind('myFlag
    ? foo
    : bar');

  /* ✗ BAD */
  color: v-bind('myFlag ? foo : bar');
}
</style>
```

</eslint-code-block>

## :books: Further Reading

- [multiline-ternary]

[multiline-ternary]: https://eslint.org/docs/rules/multiline-ternary

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.7.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/multiline-ternary.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/multiline-ternary.js)

<sup>Taken with ❤️ [from ESLint core](https://eslint.org/docs/latest/rules/multiline-ternary)</sup>
