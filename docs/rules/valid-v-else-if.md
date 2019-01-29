---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-v-else-if
description: enforce valid `v-else-if` directives
---
# vue/valid-v-else-if
> enforce valid `v-else-if` directives

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

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
  <div v-else-if/>
  <div v-else-if:aaa="foo"/>
  <div v-else-if.bbb="foo"/>
</template>
```

</eslint-code-block>

::: warning Note
This rule does not check syntax errors in directives because it's checked by [no-parsing-error] rule.
:::

## :wrench: Options

Nothing.

## :couple: Related rules

- [valid-v-if]
- [valid-v-else]
- [no-parsing-error]


[valid-v-if]: valid-v-if.md
[valid-v-else]: valid-v-else.md
[no-parsing-error]: no-parsing-error.md

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-v-else-if.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-v-else-if.js)
