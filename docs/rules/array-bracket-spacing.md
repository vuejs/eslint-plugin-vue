---
pageClass: rule-details
sidebarDepth: 0
title: vue/array-bracket-spacing
description: Enforce consistent spacing inside array brackets in `<template>`
since: v5.2.0
---

# vue/array-bracket-spacing

> Enforce consistent spacing inside array brackets in `<template>`

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule is the same rule as [@stylistic/array-bracket-spacing] rule but it applies to the expressions in `<template>`.

This rule extends the rule that [@stylistic/eslint-plugin] has, but if [@stylistic/eslint-plugin] is not installed, this rule extracts and extends the same rule from ESLint core.
However, if neither is found, the rule cannot be used.

[@stylistic/eslint-plugin]: https://eslint.style/packages/default

## :books: Further Reading

- [@stylistic/array-bracket-spacing]
- [array-bracket-spacing]

[@stylistic/array-bracket-spacing]: https://eslint.style/rules/default/array-bracket-spacing
[array-bracket-spacing]: https://eslint.org/docs/rules/array-bracket-spacing

## :rocket: Version

This rule was introduced in eslint-plugin-vue v5.2.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/array-bracket-spacing.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/array-bracket-spacing.js)

<sup>Taken with ❤️ [from ESLint Stylistic](https://eslint.style/rules/js/array-bracket-spacing)</sup>
