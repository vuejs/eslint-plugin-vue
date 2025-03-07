---
pageClass: rule-details
sidebarDepth: 0
title: vue/mustache-interpolation-spacing
description: enforce unified spacing in mustache interpolations
since: v3.13.0
---

# vue/mustache-interpolation-spacing

> enforce unified spacing in mustache interpolations

- :gear: This rule is included in all of `"plugin:vue/strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/vue2-strongly-recommended"`, `*.configs["flat/vue2-strongly-recommended"]`, `"plugin:vue/recommended"`, `*.configs["flat/recommended"]`, `"plugin:vue/vue2-recommended"` and `*.configs["flat/vue2-recommended"]`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule aims at enforcing unified spacing in mustache interpolations.

<eslint-code-block fix :rules="{'vue/mustache-interpolation-spacing': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div>{{ text }}</div>
  <div>{{   text   }}</div><!-- Use vue/no-multi-spaces rule to disallow multiple spaces. -->

  <!-- ✗ BAD -->
  <div>{{text}}</div>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/mustache-interpolation-spacing": ["error", "always" | "never"]
}
```

- `"always"` (default) ... Expect one space between expression and curly brackets.
- `"never"` ... Expect no spaces between expression and curly brackets.

### `"never"`

<eslint-code-block fix :rules="{'vue/mustache-interpolation-spacing': ['error', 'never']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div>{{text}}</div>

  <!-- ✗ BAD -->
  <div>{{   text   }}</div>
  <div>{{ text }}</div>
</template>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v3.13.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/mustache-interpolation-spacing.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/mustache-interpolation-spacing.js)
