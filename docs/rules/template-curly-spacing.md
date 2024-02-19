---
pageClass: rule-details
sidebarDepth: 0
title: vue/template-curly-spacing
description: Require or disallow spacing around embedded expressions of template strings in `<template>`
since: v7.0.0
---

# vue/template-curly-spacing

> Require or disallow spacing around embedded expressions of template strings in `<template>`

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule is the same rule as [@stylistic/template-curly-spacing] rule but it applies to the expressions in `<template>`.

This rule extends the rule that [@stylistic/eslint-plugin] has, but if [@stylistic/eslint-plugin] is not installed, this rule extracts and extends the same rule from ESLint core.
However, if neither is found, the rule cannot be used.

[@stylistic/eslint-plugin]: https://eslint.style/packages/default

## :books: Further Reading

- [@stylistic/template-curly-spacing]
- [template-curly-spacing]

[@stylistic/template-curly-spacing]: https://eslint.style/rules/default/template-curly-spacing
[template-curly-spacing]: https://eslint.org/docs/rules/template-curly-spacing

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/template-curly-spacing.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/template-curly-spacing.js)

<sup>Taken with ❤️ [from ESLint Stylistic](https://eslint.style/rules/js/template-curly-spacing)</sup>
