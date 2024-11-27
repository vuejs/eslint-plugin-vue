---
pageClass: rule-details
sidebarDepth: 0
title: vue/array-element-newline
description: Enforce line breaks after each array element in `<template>`
since: v9.9.0
---

# vue/array-element-newline

> Enforce line breaks after each array element in `<template>`

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule is the same rule as [@stylistic/array-element-newline] rule but it applies to the expressions in `<template>`.

This rule extends the rule that [@stylistic/eslint-plugin] has, but if [@stylistic/eslint-plugin] is not installed, this rule extracts and extends the same rule from ESLint core.
However, if neither is found, the rule cannot be used.

[@stylistic/eslint-plugin]: https://eslint.style/packages/default

## :books: Further Reading

- [@stylistic/array-element-newline]
- [@stylistic/array-bracket-spacing]
- [@stylistic/array-bracket-newline]
- [array-bracket-spacing]
- [array-bracket-newline]
- [array-element-newline]

[@stylistic/array-element-newline]: https://eslint.style/rules/default/array-element-newline
[@stylistic/array-bracket-spacing]: https://eslint.style/rules/default/array-bracket-spacing
[@stylistic/array-bracket-newline]: https://eslint.style/rules/default/array-bracket-newline
[array-bracket-spacing]: https://eslint.org/docs/rules/array-bracket-spacing
[array-bracket-newline]: https://eslint.org/docs/rules/array-bracket-newline
[array-element-newline]: https://eslint.org/docs/rules/array-element-newline

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.9.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/array-element-newline.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/array-element-newline.js)

<sup>Taken with ❤️ [from ESLint Stylistic](https://eslint.style/rules/js/array-element-newline)</sup>
