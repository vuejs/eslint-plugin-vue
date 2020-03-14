---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-template-root
description: enforce valid template root
---
# vue/valid-template-root
> enforce valid template root

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

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

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-template-root.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-template-root.js)
