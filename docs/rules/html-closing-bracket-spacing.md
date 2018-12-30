---
pageClass: rule-details
sidebarDepth: 0
title: vue/html-closing-bracket-spacing
description: require or disallow a space before tag's closing brackets
---
# vue/html-closing-bracket-spacing
> require or disallow a space before tag's closing brackets

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule aims to enforce consistent spacing style before closing brackets `>` of tags.

<eslint-code-block fix :rules="{'vue/html-closing-bracket-spacing': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div>
  <div foo>
  <div foo="bar">
  </div>
  <div />
  <div foo />
  <div foo="bar" />

  <!-- ✗ BAD -->
  <div >
  <div foo >
  <div foo="bar" >
  </div >
  <div/>
  <div foo/>
  <div foo="bar"/>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/html-closing-bracket-spacing": ["error", {
    "startTag": "always" | "never",
    "endTag": "always" | "never",
    "selfClosingTag": "always" | "never"
  }]
}
```

- `startTag` (`"always" | "never"`) ... Setting for the `>` of start tags (e.g. `<div>`). Default is `"never"`.
    - `"always"` ... requires one or more spaces.
    - `"never"` ... disallows spaces.
- `endTag` (`"always" | "never"`) ... Setting for the `>` of end tags (e.g. `</div>`). Default is `"never"`.
    - `"always"` ... requires one or more spaces.
    - `"never"` ... disallows spaces.
- `selfClosingTag` (`"always" | "never"`) ... Setting for the `/>` of self-closing tags (e.g. `<div/>`). Default is `"always"`.
    - `"always"` ... requires one or more spaces.
    - `"never"` ... disallows spaces.

### `"startTag": "always", "endTag": "always", "selfClosingTag": "always"`

<eslint-code-block fix :rules="{'vue/html-closing-bracket-spacing': ['error', {startTag: 'always', endTag: 'always', selfClosingTag: 'always' }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div >
  <div foo >
  <div foo="bar" >
  </div >
  <div />
  <div foo />
  <div foo="bar" />
</template>
```

</eslint-code-block>

## :couple: Related rules

- [vue/no-multi-spaces](./no-multi-spaces.md)
- [vue/html-closing-bracket-newline](./html-closing-bracket-newline.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/html-closing-bracket-spacing.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/html-closing-bracket-spacing.js)
