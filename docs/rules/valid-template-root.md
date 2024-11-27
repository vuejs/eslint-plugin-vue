---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-template-root
description: enforce valid template root
since: v3.11.0
---

# vue/valid-template-root

> enforce valid template root

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `*.configs["flat/essential"]`, `"plugin:vue/essential"`, `*.configs["flat/vue2-essential"]`, `"plugin:vue/vue3-strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/strongly-recommended"`, `*.configs["flat/vue2-strongly-recommended"]`, `"plugin:vue/vue3-recommended"`, `*.configs["flat/recommended"]`, `"plugin:vue/recommended"` and `*.configs["flat/vue2-recommended"]`.

This rule checks whether every template root is valid.

## :book: Rule Details

This rule reports the template root in the following cases:

<eslint-code-block :rules="{'vue/valid-template-root': ['error']}">

```vue
<!-- There is no root element -->
<template></template>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/valid-template-root': ['error']}">

```vue
<!-- The root with src attribute is not empty -->
<template src="foo.html"><div></div></template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v3.11.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-template-root.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-template-root.js)
