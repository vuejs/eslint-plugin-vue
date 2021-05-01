---
pageClass: rule-details
sidebarDepth: 0
title: vue/html-button-has-type
description: disallow usage of button without an explicit type attribute
since: v7.6.0
---
# vue/html-button-has-type

> disallow usage of button without an explicit type attribute

Forgetting the type attribute on a button defaults it to being a submit type.
This is nearly never what is intended, especially in your average one-page application.

## :book: Rule Details

This rule aims to warn if no type or an invalid type is used on a button type attribute.

<eslint-code-block :rules="{'vue/html-button-has-type': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button type="button">Hello World</button>
  <button type="submit">Hello World</button>
  <button type="reset">Hello World</button>

  <!-- ✗ BAD -->
  <button>Hello World</button>
  <button type="">Hello World</button>
  <button type="foo">Hello World</button>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/html-button-has-type": ["error", {
    "button": true,
    "submit": true,
    "reset": true
  }]
}
```

- `button` ... `<button type="button"></button>`
  - `true` (default) ... allow value `button`.
  - `false"` ... disallow value `button`.
- `submit` ... `<button type="submit"></button>`
  - `true` (default) ... allow value `submit`.
  - `false"` ... disallow value `submit`.
- `reset` ... `<button type="reset"></button>`
  - `true` (default) ... allow value `reset`.
  - `false"` ... disallow value `reset`.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.6.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/html-button-has-type.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/html-button-has-type.js)
