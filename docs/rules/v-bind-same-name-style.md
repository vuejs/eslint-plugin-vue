---
pageClass: rule-details
sidebarDepth: 0
title: vue/v-bind-same-name-style
description: enforce `v-bind` same name directive style
---
# vue/v-bind-same-name-style

> enforce `v-bind` same name directive style

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces `v-bind` same-name directive style which you should use always or never use shorthand form.

<eslint-code-block fix :rules="{'vue/v-bind-same-name-style': ['error', 'never']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div :foo="foo" />
  <div v-bind:foo="foo" />

  <!-- ✗ BAD -->
  <div :foo />
  <div v-bind:foo />
</template>
```

</eslint-code-block>

## :wrench: Options

Default is set to `never`.

```json
{
  "vue/v-bind-same-name-style": ["error", "never" | "always"]
}
```

- `"never"` (default) ... requires never using shorthand.
- `"always"` ... requires using shorthand.

### `"always"`

<eslint-code-block fix :rules="{'vue/v-bind-same-name-style': ['error', 'always']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div :foo />
  <div v-bind:foo />

  <!-- ✗ BAD -->
  <div :foo="foo" />
  <div v-bind:foo="foo" />
</template>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/v-bind-same-name-style.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/v-bind-same-name-style.js)
