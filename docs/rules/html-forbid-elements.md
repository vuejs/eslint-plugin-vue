---
pageClass: rule-details
sidebarDepth: 0
title: vue/html-forbid-elements
description: prevent use of forbidden html elements
since: v8.6.0
---

# vue/html-forbid-elements

> prevent use of forbidden html elements

## :book: Rule Details

This rule aims to disallow html elements that have been forbidden.

<eslint-code-block fix :rules="{'vue/html-forbid-elements': ['error', { forbid: ['div', 'button'] } ] }">

```vue
<template>
  <!-- ✓ GOOD -->
  <p></p>
  <input />
  <br />

  <!-- ✗ BAD -->
  <button></button>
  <div></div>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/html-forbid-elements": ["error", { "forbid": ["button"] }]
}
```

## :rocket: Version

This rule was introduced in eslint-plugin-vue v8.6.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/html-forbid-elements.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/html-forbid-elements.js)
