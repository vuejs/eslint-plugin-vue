---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-v-else
description: enforce valid `v-else` directives
---
# vue/valid-v-else
> enforce valid `v-else` directives

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every `v-else` directive is valid.

## :book: Rule Details

This rule reports `v-else` directives in the following cases:

- The directive has that argument. E.g. `<div v-if="foo"></div><div v-else:aaa></div>`
- The directive has that modifier. E.g. `<div v-if="foo"></div><div v-else.bbb></div>`
- The directive has that attribute value. E.g. `<div v-if="foo"></div><div v-else="bar"></div>`
- The directive is on the elements that the previous element don't have `v-if`/`v-else-if` directives. E.g. `<div v-else></div>`
- The directive is on the elements which have `v-if`/`v-else-if` directives. E.g. `<div v-if="foo" v-else></div>`

<eslint-code-block :rules="{'vue/valid-v-else': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-if="foo"/>
  <div v-else/>

  <!-- ✗ BAD -->
  <div v-else="foo"/>
  <div v-else:aaa/>
  <div v-else.bbb/>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related rules

- [valid-v-if]
- [valid-v-else-if]
- [no-parsing-error]


[valid-v-if]: valid-v-if.md
[valid-v-else-if]: valid-v-else-if.md
[no-parsing-error]: no-parsing-error.md

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-v-else.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-v-else.js)
