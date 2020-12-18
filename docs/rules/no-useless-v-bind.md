---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-useless-v-bind
description: disallow unnecessary `v-bind` directives
---
# vue/no-useless-v-bind
> disallow unnecessary `v-bind` directives

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports `v-bind` with a string literal value.  
The `v-bind` with a string literal value can be changed to a static attribute definition.

<eslint-code-block fix :rules="{'vue/no-useless-v-bind': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div foo="bar"/>
  <div :foo="bar"/>

  <!-- ✗ BAD -->
  <div v-bind:foo="'bar'"/>
  <div :foo="'bar'"/>
</template>
```

</eslint-code-block>

## :wrench: Options

```js
{
  "vue/no-useless-v-bind": ["error", {
    "ignoreIncludesComment": false,
    "ignoreStringEscape": false
  }]
}
```

- `ignoreIncludesComment` ... If `true`, do not report expressions containing comments. default `false`.
- `ignoreStringEscape` ... If `true`, do not report string literals with useful escapes. default `false`.

### `"ignoreIncludesComment": true`

<eslint-code-block fix :rules="{'vue/no-useless-v-bind': ['error', {ignoreIncludesComment: true}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-bind:foo="'bar'/* comment */"/>

  <!-- ✗ BAD -->
  <div v-bind:foo="'bar'"/>
</template>
```

</eslint-code-block>

### `"ignoreStringEscape": true`

<eslint-code-block fix :rules="{'vue/no-useless-v-bind': ['error', {ignoreStringEscape: true}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-bind:foo="'bar\nbaz'"/>
</template>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/no-useless-mustaches]
- [vue/no-useless-concat]

[vue/no-useless-mustaches]: ./no-useless-mustaches.md
[vue/no-useless-concat]: ./no-useless-concat.md

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-useless-v-bind.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-useless-v-bind.js)
