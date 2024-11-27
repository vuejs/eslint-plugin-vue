---
pageClass: rule-details
sidebarDepth: 0
title: vue/comma-style
description: Enforce consistent comma style in `<template>`
since: v7.0.0
---

# vue/comma-style

> Enforce consistent comma style in `<template>`

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule is the same rule as [@stylistic/comma-style] rule but it applies to the expressions in `<template>`.

This rule extends the rule that [@stylistic/eslint-plugin] has, but if [@stylistic/eslint-plugin] is not installed, this rule extracts and extends the same rule from ESLint core.
However, if neither is found, the rule cannot be used.

[@stylistic/eslint-plugin]: https://eslint.style/packages/default

## :books: Further Reading

- [@stylistic/comma-style]
- [comma-style]

[@stylistic/comma-style]: https://eslint.style/rules/default/comma-style
[comma-style]: https://eslint.org/docs/rules/comma-style

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/comma-style.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/comma-style.js)

<sup>Taken with ❤️ [from ESLint Stylistic](https://eslint.style/rules/js/comma-style)</sup>
