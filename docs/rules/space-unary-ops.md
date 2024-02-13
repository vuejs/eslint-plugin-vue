---
pageClass: rule-details
sidebarDepth: 0
title: vue/space-unary-ops
description: Enforce consistent spacing before or after unary operators in `<template>`
since: v5.2.0
---

# vue/space-unary-ops

> Enforce consistent spacing before or after unary operators in `<template>`

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule is the same rule as [@stylistic/space-unary-ops] rule but it applies to the expressions in `<template>`.

This rule extends the rule that [@stylistic/eslint-plugin] has, but if [@stylistic/eslint-plugin] is not installed, this rule extracts and extends the same rule from ESLint core.
However, if neither is found, the rule cannot be used.

[@stylistic/eslint-plugin]: https://eslint.style/packages/default

## :books: Further Reading

- [@stylistic/space-unary-ops]
- [space-unary-ops]

[@stylistic/space-unary-ops]: https://eslint.style/rules/default/space-unary-ops
[space-unary-ops]: https://eslint.org/docs/rules/space-unary-ops

## :rocket: Version

This rule was introduced in eslint-plugin-vue v5.2.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/space-unary-ops.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/space-unary-ops.js)

<sup>Taken with ❤️ [from ESLint Stylistic](https://eslint.style/rules/js/space-unary-ops)</sup>
