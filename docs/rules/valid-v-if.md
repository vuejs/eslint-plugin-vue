---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-v-if
description: enforce valid `v-if` directives
since: v3.11.0
---

# vue/valid-v-if

> enforce valid `v-if` directives

- :gear: This rule is included in the following preset configs:
  - `*.configs["flat/essential"]`
  - `*.configs["flat/vue2-essential"]`
  - `*.configs["flat/strongly-recommended"]`
  - `*.configs["flat/vue2-strongly-recommended"]`
  - `*.configs["flat/recommended"]`
  - `*.configs["flat/vue2-recommended"]`
  - `"plugin:vue/essential"`
  - `"plugin:vue/vue2-essential"`
  - `"plugin:vue/strongly-recommended"`
  - `"plugin:vue/vue2-strongly-recommended"`
  - `"plugin:vue/recommended"`
  - `"plugin:vue/vue2-recommended"`

This rule checks whether every `v-if` directive is valid.

## :book: Rule Details

This rule reports `v-if` directives in the following cases:

- The directive has an argument. E.g. `<div v-if:aaa="foo"></div>`
- The directive has a modifier. E.g. `<div v-if.bbb="foo"></div>`
- The directive does not have an attribute value. E.g. `<div v-if></div>`
- The directive is on an element that has a `v-else`/`v-else-if` directive. E.g. `<div v-else v-if="foo"></div>`

<eslint-code-block :rules="{'vue/valid-v-if': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-if="foo" />
  <div v-else-if="bar" />
  <div v-else />

  <!-- ✗ BAD -->
  <div v-if />
  <div v-if:aaa="foo" />
  <div v-if.bbb="foo" />
  <div
    v-if="foo"
    v-else
  />
  <div
    v-if="foo"
    v-else-if="bar"
  />
</template>
```

</eslint-code-block>

::: warning Note
This rule does not check syntax errors in directives because the [vue/no-parsing-error] rule checks them.
:::

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/valid-v-else]
- [vue/valid-v-else-if]
- [vue/no-parsing-error]

[vue/valid-v-else]: ./valid-v-else.md
[vue/valid-v-else-if]: ./valid-v-else-if.md
[vue/no-parsing-error]: ./no-parsing-error.md

## :rocket: Version

This rule was introduced in eslint-plugin-vue v3.11.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-v-if.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-v-if.test.ts)
