---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-unused-vars
description: disallow unused variable definitions of v-for directives or scope attributes
since: v3.14.0
---

# vue/no-unused-vars

> disallow unused variable definitions of v-for directives or scope attributes

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `*.configs["flat/essential"]`, `"plugin:vue/essential"`, `*.configs["flat/vue2-essential"]`, `"plugin:vue/vue3-strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/strongly-recommended"`, `*.configs["flat/vue2-strongly-recommended"]`, `"plugin:vue/vue3-recommended"`, `*.configs["flat/recommended"]`, `"plugin:vue/recommended"` and `*.configs["flat/vue2-recommended"]`.
- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

This rule report variable definitions of v-for directives or scope attributes if those are not used.

<eslint-code-block :rules="{'vue/no-unused-vars': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <ol v-for="i in 5">
    <li>{{ i }}</li>
  </ol>

  <!-- ✗ BAD -->
  <ol v-for="i in 5">
    <li>item</li>
  </ol>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
    "vue/no-unused-vars": ["error", {
        "ignorePattern": "^_"
    }]
}
```

- `ignorePattern` ... disables reporting when your definitions of v-for directives or scope attributes match your ignorePattern Regular expression. default `null`, will ignore nothing

## :rocket: Suggestion

- When your ignorePattern set to `^_`, we could provide a suggestion which add a prefix`_` to your variable and no more eslint error

## :rocket: Version

This rule was introduced in eslint-plugin-vue v3.14.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-unused-vars.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-unused-vars.js)
