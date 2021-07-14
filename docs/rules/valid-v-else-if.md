---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-v-else-if
description: enforce valid `v-else-if` directives
since: v3.11.0
---
# vue/valid-v-else-if

> enforce valid `v-else-if` directives

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every `v-else-if` directive is valid.

## :book: Rule Details

This rule reports `v-else-if` directives in the following cases:

- The directive has that argument. E.g. `<div v-if="foo"></div><div v-else-if:aaa="bar"></div>`
- The directive has that modifier. E.g. `<div v-if="foo"></div><div v-else-if.bbb="bar"></div>`
- The directive does not have that attribute value. E.g. `<div v-if="foo"></div><div v-else-if></div>`
- The directive is on the elements that the previous element don't have `v-if`/`v-else-if` directives. E.g. `<div v-else-if="bar"></div>`
- The directive is on the elements which have `v-if`/`v-else` directives. E.g. `<div v-if="foo" v-else-if="bar"></div>`

<eslint-code-block :rules="{'vue/valid-v-else-if': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-if="foo"/>
  <div v-else-if="bar"/>

  <!-- ✗ BAD -->
  <div /><div v-else-if="foo"/>
  <div v-if="x"/><div v-else-if/>
  <div v-if="x"/><div v-else-if:aaa="foo"/>
  <div v-if="x"/><div v-else-if.bbb="foo"/>
</template>
```

</eslint-code-block>

::: warning Note
This rule does not check syntax errors in directives because it's checked by [vue/no-parsing-error] rule.
:::

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/valid-v-if]
- [vue/valid-v-else]
- [vue/no-parsing-error]

[vue/valid-v-if]: ./valid-v-if.md
[vue/valid-v-else]: ./valid-v-else.md
[vue/no-parsing-error]: ./no-parsing-error.md

## :rocket: Version

This rule was introduced in eslint-plugin-vue v3.11.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-v-else-if.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-v-else-if.js)
