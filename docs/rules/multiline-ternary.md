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

This rule is the same rule as [@stylistic/multiline-ternary] rule but it applies to the expressions in `<template>` and `<style>`.

This rule extends the rule that [@stylistic/eslint-plugin] has, but if [@stylistic/eslint-plugin] is not installed, this rule extracts and extends the same rule from ESLint core.
However, if neither is found, the rule cannot be used.

[@stylistic/eslint-plugin]: https://eslint.style/packages/default

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

- [@stylistic/multiline-ternary]
- [multiline-ternary]

[@stylistic/multiline-ternary]: https://eslint.style/rules/default/multiline-ternary
[multiline-ternary]: https://eslint.org/docs/rules/multiline-ternary

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.7.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/multiline-ternary.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/multiline-ternary.js)

<sup>Taken with ❤️ [from ESLint Stylistic](https://eslint.style/rules/js/multiline-ternary)</sup>
