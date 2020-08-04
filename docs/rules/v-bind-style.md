---
pageClass: rule-details
sidebarDepth: 0
title: vue/v-bind-style
description: enforce `v-bind` directive style
---
# vue/v-bind-style
> enforce `v-bind` directive style

- :gear: This rule is included in all of `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces `v-bind` directive style which you should use shorthand or long form.

<eslint-code-block fix :rules="{'vue/v-bind-style': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div :foo="bar"/>

  <!-- ✗ BAD -->
  <div v-bind:foo="bar"/>
</template>
```

</eslint-code-block>

## :wrench: Options
Default is set to `shorthand`.

```json
{
  "vue/v-bind-style": ["error", "shorthand" | "longform"]
}
```

- `"shorthand"` (default) ... requires using shorthand.
- `"longform"` ... requires using long form.

### `"longform"`

<eslint-code-block fix :rules="{'vue/v-bind-style': ['error', 'longform']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-bind:foo="bar"/>

  <!-- ✗ BAD -->
  <div :foo="bar"/>
</template>
```

</eslint-code-block>

## :books: Further Reading

- [Style guide - Directive shorthands](https://v3.vuejs.org/style-guide/#directive-shorthands-strongly-recommended)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/v-bind-style.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/v-bind-style.js)
