---
pageClass: rule-details
sidebarDepth: 0
title: vue/dot-location
description: Enforce consistent newlines before and after dots in `<template>`
since: v6.0.0
---

# vue/dot-location

> Enforce consistent newlines before and after dots in `<template>`

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule is the same rule as [@stylistic/dot-location] rule but it applies to the expressions in `<template>`.

This rule extends the rule that [@stylistic/eslint-plugin] has, but if [@stylistic/eslint-plugin] is not installed, this rule extracts and extends the same rule from ESLint core.
However, if neither is found, the rule cannot be used.

[@stylistic/eslint-plugin]: https://eslint.style/packages/default

## :books: Further Reading

- [@stylistic/dot-location]
- [dot-location]

[@stylistic/dot-location]: https://eslint.style/rules/default/dot-location
[dot-location]: https://eslint.org/docs/rules/dot-location

## :rocket: Version

This rule was introduced in eslint-plugin-vue v6.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/dot-location.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/dot-location.js)

<sup>Taken with ❤️ [from ESLint Stylistic](https://eslint.style/rules/js/dot-location)</sup>
