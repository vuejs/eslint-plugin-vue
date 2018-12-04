---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-slot-scope
description: enforce valid `slot-scope` attributes
---
# vue/valid-slot-scope
> enforce valid `slot-scope` attributes

This rule checks whether every `slot-scope` (or `scope`) attributes is valid.

## :book: Rule Details

This rule reports `slot-scope` attributes in the following cases:

- The `slot-scope` attribute does not have that attribute value. E.g. `<div slot-scope></div>`

<eslint-code-block :rules="{'vue/valid-slot-scope': ['error']}">
```vue
<template>
  <!-- ✓ GOOD -->
  <TheComponent>
    <template slot-scope="prop">
      ...
    </template>
  </TheComponent>
  <TheComponent>
    <template slot-scope="{ a, b, c }">
      ...
    </template>
  </TheComponent>
  <TheComponent>
    <template slot-scope="[ a, b, c ]">
      ...
    </template>
  </TheComponent>

  <!-- ✗ BAD -->
  <TheComponent>
    <template slot-scope>
      ...
    </template>
  </TheComponent>
  <TheComponent>
    <template slot-scope="">
      ...
    </template>
  </TheComponent>
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

## :books: Further reading

- [Guide - Scoped Slots](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots)

[no-parsing-error]: no-parsing-error.md

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-slot-scope.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-slot-scope.js)
