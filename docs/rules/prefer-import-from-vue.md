---
pageClass: rule-details
sidebarDepth: 0
title: vue/prefer-import-from-vue
description: enforce import from 'vue' instead of import from '@vue/*'
since: v8.5.0
---
# vue/prefer-import-from-vue

> enforce import from 'vue' instead of import from '@vue/*'

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule aims to use imports from `'vue'` instead of imports from `'@vue/*'`.

Imports from the following modules are almost always wrong. You should import from `vue` instead.

- `@vue/runtime-dom`
- `@vue/runtime-core`
- `@vue/reactivity`
- `@vue/shared`

<eslint-code-block fix :rules="{'vue/prefer-import-from-vue': ['error']}" filename="example.js" language="javascript">

```js
/* ✓ GOOD */
import { createApp, ref, Component } from 'vue'
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/prefer-import-from-vue': ['error']}" filename="example.js" language="javascript">

```js
/* ✗ BAD */
import { createApp } from '@vue/runtime-dom'
import { Component } from '@vue/runtime-core'
import { ref } from '@vue/reactivity'
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v8.5.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/prefer-import-from-vue.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/prefer-import-from-vue.js)
