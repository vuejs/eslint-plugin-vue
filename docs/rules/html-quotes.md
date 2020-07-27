---
pageClass: rule-details
sidebarDepth: 0
title: vue/html-quotes
description: enforce quotes style of HTML attributes
---
# vue/html-quotes
> enforce quotes style of HTML attributes

- :gear: This rule is included in all of `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

You can choose quotes of HTML attributes from:

- Double quotes: `<div class="foo">`
- Single quotes: `<div class='foo'>`
- No quotes: `<div class=foo>`

This rule enforces the quotes style of HTML attributes.

## :book: Rule Details

This rule reports the quotes of attributes if it is different to configured quotes.

<eslint-code-block fix :rules="{'vue/html-quotes': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <img src="./logo.png">

  <!-- ✗ BAD -->
  <img src='./logo.png'>
  <img src=./logo.png>
</template>
```

</eslint-code-block>

## :wrench: Options

Default is set to `double`.

```json
{
  "vue/html-quotes": [ "error", "double" | "single", { "avoidEscape": false } ]
}
```

String option:

- `"double"` (default) ... requires double quotes.
- `"single"` ... requires single quotes.

Object option:

- `avoidEscape` ... If `true`, allows strings to use single-quotes or double-quotes so long as the string contains a quote that would have to be escaped otherwise.

### `"single"`

<eslint-code-block fix :rules="{'vue/html-quotes': ['error', 'single']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <img src='./logo.png'>

  <!-- ✗ BAD -->
  <img src="./logo.png">
  <img src=./logo.png>
</template>
```

</eslint-code-block>

### `"double", { "avoidEscape": true }`

<eslint-code-block fix :rules="{'vue/html-quotes': ['error', 'double', { avoidEscape: true }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <img title='a string containing "double" quotes'>

  <!-- ✗ BAD -->
  <img title='foo'>
  <img title=bar>
</template>
```

</eslint-code-block>

## :books: Further Reading

- [Style guide - Quoted attribute values](https://v3.vuejs.org/style-guide/#Quoted-attribute-values-strongly-recommended)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/html-quotes.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/html-quotes.js)
