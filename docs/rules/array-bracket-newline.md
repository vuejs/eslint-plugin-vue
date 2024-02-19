---
pageClass: rule-details
sidebarDepth: 0
title: vue/array-bracket-newline
description: Enforce linebreaks after opening and before closing array brackets in `<template>`
since: v7.1.0
---

# vue/array-bracket-newline

> Enforce linebreaks after opening and before closing array brackets in `<template>`

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule is the same rule as [@stylistic/array-bracket-newline] rule but it applies to the expressions in `<template>`.

This rule extends the rule that [@stylistic/eslint-plugin] has, but if [@stylistic/eslint-plugin] is not installed, this rule extracts and extends the same rule from ESLint core.
However, if neither is found, the rule cannot be used.

[@stylistic/eslint-plugin]: https://eslint.style/packages/default

## :books: Further Reading

- [@stylistic/array-bracket-newline]
- [array-bracket-newline]

[@stylistic/array-bracket-newline]: https://eslint.style/rules/default/array-bracket-newline
[array-bracket-newline]: https://eslint.org/docs/rules/array-bracket-newline

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.1.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/array-bracket-newline.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/array-bracket-newline.js)

<sup>Taken with ❤️ [from ESLint Stylistic](https://eslint.style/rules/js/array-bracket-newline)</sup>
