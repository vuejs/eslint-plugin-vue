---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-extra-parens
description: Disallow unnecessary parentheses in `<template>`
since: v7.0.0
---

# vue/no-extra-parens

> Disallow unnecessary parentheses in `<template>`

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule is the same rule as [@stylistic/no-extra-parens] rule but it applies to the expressions in `<template>`.

This rule extends the rule that [@stylistic/eslint-plugin] has, but if [@stylistic/eslint-plugin] is not installed, this rule extracts and extends the same rule from ESLint core.
However, if neither is found, the rule cannot be used.

[@stylistic/eslint-plugin]: https://eslint.style/packages/default

## :book: Rule Details

This rule restricts the use of parentheses to only where they are necessary.  
This rule extends the [@stylistic/no-extra-parens] rule and applies it to the `<template>`. This rule also checks some Vue.js syntax.

<eslint-code-block fix :rules="{'vue/no-extra-parens': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div :class="foo + bar" />
  {{ foo + bar }}
  {{ foo + bar | filter }}
  <!-- ✗ BAD -->
  <div :class="(foo + bar)" />
  {{ (foo + bar) }}
  {{ (foo + bar) | filter }}
</template>
```

</eslint-code-block>

## :books: Further Reading

- [@stylistic/no-extra-parens]
- [no-extra-parens]

[@stylistic/no-extra-parens]: https://eslint.style/rules/default/no-extra-parens
[no-extra-parens]: https://eslint.org/docs/rules/no-extra-parens

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-extra-parens.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-extra-parens.js)

<sup>Taken with ❤️ [from ESLint Stylistic](https://eslint.style/rules/ts/no-extra-parens)</sup>
