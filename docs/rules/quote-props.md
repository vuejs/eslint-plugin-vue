---
pageClass: rule-details
sidebarDepth: 0
title: vue/quote-props
description: Require quotes around object literal property names in `<template>`
since: v8.4.0
---

# vue/quote-props

> Require quotes around object literal property names in `<template>`

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule is the same rule as [@stylistic/quote-props] rule but it applies to the expressions in `<template>`.

This rule extends the rule that [@stylistic/eslint-plugin] has, but if [@stylistic/eslint-plugin] is not installed, this rule extracts and extends the same rule from ESLint core.
However, if neither is found, the rule cannot be used.

[@stylistic/eslint-plugin]: https://eslint.style/packages/default

## :books: Further Reading

- [@stylistic/quote-props]
- [quote-props]

[@stylistic/quote-props]: https://eslint.style/rules/default/quote-props
[quote-props]: https://eslint.org/docs/rules/quote-props

## :rocket: Version

This rule was introduced in eslint-plugin-vue v8.4.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/quote-props.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/quote-props.js)

<sup>Taken with ❤️ [from ESLint Stylistic](https://eslint.style/rules/ts/quote-props)</sup>
