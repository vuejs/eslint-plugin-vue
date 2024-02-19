---
pageClass: rule-details
sidebarDepth: 0
title: vue/key-spacing
description: Enforce consistent spacing between keys and values in object literal properties in `<template>`
since: v5.2.0
---

# vue/key-spacing

> Enforce consistent spacing between keys and values in object literal properties in `<template>`

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule is the same rule as [@stylistic/key-spacing] rule but it applies to the expressions in `<template>`.

This rule extends the rule that [@stylistic/eslint-plugin] has, but if [@stylistic/eslint-plugin] is not installed, this rule extracts and extends the same rule from ESLint core.
However, if neither is found, the rule cannot be used.

[@stylistic/eslint-plugin]: https://eslint.style/packages/default

## :books: Further Reading

- [@stylistic/key-spacing]
- [key-spacing]

[@stylistic/key-spacing]: https://eslint.style/rules/default/key-spacing
[key-spacing]: https://eslint.org/docs/rules/key-spacing

## :rocket: Version

This rule was introduced in eslint-plugin-vue v5.2.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/key-spacing.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/key-spacing.js)

<sup>Taken with ❤️ [from ESLint Stylistic](https://eslint.style/rules/ts/key-spacing)</sup>
