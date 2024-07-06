---
pageClass: rule-details
sidebarDepth: 0
title: vue/object-curly-newline
description: Enforce consistent line breaks after opening and before closing braces in `<template>`
since: v7.0.0
---

# vue/object-curly-newline

> Enforce consistent line breaks after opening and before closing braces in `<template>`

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule is the same rule as [@stylistic/object-curly-newline] rule but it applies to the expressions in `<template>`.

This rule extends the rule that [@stylistic/eslint-plugin] has, but if [@stylistic/eslint-plugin] is not installed, this rule extracts and extends the same rule from ESLint core.
However, if neither is found, the rule cannot be used.

[@stylistic/eslint-plugin]: https://eslint.style/packages/default

## :books: Further Reading

- [@stylistic/object-curly-newline]
- [object-curly-newline]

[@stylistic/object-curly-newline]: https://eslint.style/rules/default/object-curly-newline
[object-curly-newline]: https://eslint.org/docs/rules/object-curly-newline

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/object-curly-newline.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/object-curly-newline.js)

<sup>Taken with ❤️ [from ESLint Stylistic](https://eslint.style/rules/js/object-curly-newline)</sup>
