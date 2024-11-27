---
pageClass: rule-details
sidebarDepth: 0
title: vue/arrow-spacing
description: Enforce consistent spacing before and after the arrow in arrow functions in `<template>`
since: v5.2.0
---

# vue/arrow-spacing

> Enforce consistent spacing before and after the arrow in arrow functions in `<template>`

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule is the same rule as [@stylistic/arrow-spacing] rule but it applies to the expressions in `<template>`.

This rule extends the rule that [@stylistic/eslint-plugin] has, but if [@stylistic/eslint-plugin] is not installed, this rule extracts and extends the same rule from ESLint core.
However, if neither is found, the rule cannot be used.

[@stylistic/eslint-plugin]: https://eslint.style/packages/default

## :books: Further Reading

- [@stylistic/arrow-spacing]
- [arrow-spacing]

[@stylistic/arrow-spacing]: https://eslint.style/rules/default/arrow-spacing
[arrow-spacing]: https://eslint.org/docs/rules/arrow-spacing

## :rocket: Version

This rule was introduced in eslint-plugin-vue v5.2.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/arrow-spacing.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/arrow-spacing.js)

<sup>Taken with ❤️ [from ESLint Stylistic](https://eslint.style/rules/js/arrow-spacing)</sup>
