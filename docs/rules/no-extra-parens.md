---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-extra-parens
description: disallow unnecessary parentheses
---
# vue/no-extra-parens
> disallow unnecessary parentheses

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule is the same rule as core [no-extra-parens] rule but it applies to the expressions in `<template>`.

## :book: Rule Details

This rule restricts the use of parentheses to only where they are necessary.  
This rule extends the core [no-extra-parens] rule and applies it to the `<template>`. This rule also checks some Vue.js syntax.

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

- [no-extra-parens]

[no-extra-parens]: https://eslint.org/docs/rules/no-extra-parens

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-extra-parens.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-extra-parens.js)

<sup>Taken with ❤️ [from ESLint core](https://eslint.org/docs/rules/no-extra-parens)</sup>
