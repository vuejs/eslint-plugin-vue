---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-v-show
description: enforce valid `v-show` directives
---
# vue/valid-v-show
> enforce valid `v-show` directives

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every `v-show` directive is valid.

## :book: Rule Details

This rule reports `v-show` directives in the following cases:

- The directive has that argument. E.g. `<div v-show:aaa></div>`
- The directive has that modifier. E.g. `<div v-show.bbb></div>`
- The directive does not have that attribute value. E.g. `<div v-show></div>`

<eslint-code-block :rules="{'vue/valid-v-show': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-show="foo"/>

  <!-- ✗ BAD -->
  <div v-show/>
  <div v-show:aaa="foo"/>
  <div v-show.bbb="foo"/>
</template>
```

</eslint-code-block>

::: warning Note
This rule does not check syntax errors in directives because it's checked by [no-parsing-error] rule.
:::

## :wrench: Options

Nothing.

## :couple: Related rules

- [no-parsing-error]

[no-parsing-error]: no-parsing-error.md

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-v-show.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-v-show.js)
