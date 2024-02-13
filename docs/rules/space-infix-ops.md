---
pageClass: rule-details
sidebarDepth: 0
title: vue/space-infix-ops
description: Require spacing around infix operators in `<template>`
since: v5.2.0
---

# vue/space-infix-ops

> Require spacing around infix operators in `<template>`

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule is the same rule as [@stylistic/space-infix-ops] rule but it applies to the expressions in `<template>`.

This rule extends the rule that [@stylistic/eslint-plugin] has, but if [@stylistic/eslint-plugin] is not installed, this rule extracts and extends the same rule from ESLint core.
However, if neither is found, the rule cannot be used.

[@stylistic/eslint-plugin]: https://eslint.style/packages/default

## :books: Further Reading

- [@stylistic/space-infix-ops]
- [space-infix-ops]

[@stylistic/space-infix-ops]: https://eslint.style/rules/default/space-infix-ops
[space-infix-ops]: https://eslint.org/docs/rules/space-infix-ops

## :rocket: Version

This rule was introduced in eslint-plugin-vue v5.2.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/space-infix-ops.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/space-infix-ops.js)

<sup>Taken with ❤️ [from ESLint Stylistic](https://eslint.style/rules/ts/space-infix-ops)</sup>
