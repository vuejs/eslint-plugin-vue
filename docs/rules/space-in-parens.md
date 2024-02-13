---
pageClass: rule-details
sidebarDepth: 0
title: vue/space-in-parens
description: Enforce consistent spacing inside parentheses in `<template>`
since: v7.0.0
---

# vue/space-in-parens

> Enforce consistent spacing inside parentheses in `<template>`

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule is the same rule as [@stylistic/space-in-parens] rule but it applies to the expressions in `<template>`.

This rule extends the rule that [@stylistic/eslint-plugin] has, but if [@stylistic/eslint-plugin] is not installed, this rule extracts and extends the same rule from ESLint core.
However, if neither is found, the rule cannot be used.

[@stylistic/eslint-plugin]: https://eslint.style/packages/default

## :books: Further Reading

- [@stylistic/space-in-parens]
- [space-in-parens]

[@stylistic/space-in-parens]: https://eslint.style/rules/default/space-in-parens
[space-in-parens]: https://eslint.org/docs/rules/space-in-parens

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/space-in-parens.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/space-in-parens.js)

<sup>Taken with ❤️ [from ESLint Stylistic](https://eslint.style/rules/js/space-in-parens)</sup>
