---
pageClass: rule-details
sidebarDepth: 0
title: vue/html-closing-bracket-newline
description: require or disallow a line break before tag's closing brackets
since: v4.1.0
---

# vue/html-closing-bracket-newline

> require or disallow a line break before tag's closing brackets

- :gear: This rule is included in all of `"plugin:vue/vue3-strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/strongly-recommended"`, `*.configs["flat/vue2-strongly-recommended"]`, `"plugin:vue/vue3-recommended"`, `*.configs["flat/recommended"]`, `"plugin:vue/recommended"` and `*.configs["flat/vue2-recommended"]`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

People have their own preference about the location of closing brackets.
This rule enforces a line break (or no line break) before tag's closing brackets.

```html
<div
  id="foo"
  class="bar"> <!-- On the same line with the last attribute. -->
</div>

<div
  id="foo"
  class="bar"
> <!-- On the next line. -->
</div>
```

## :book: Rule Details

This rule aims to warn the right angle brackets which are at the location other than the configured location.

<eslint-code-block fix :rules="{'vue/html-closing-bracket-newline': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div id="foo" class="bar">
  <div
    id="foo"
    class="bar"
  >

  <!-- ✗ BAD -->
  <div id="foo" class="bar"
  >
  <div
    id="foo"
    class="bar">
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/html-closing-bracket-newline": [
    "error",
    {
      "singleline": "never",
      "multiline": "always",
      "selfClosingTag": {
        "singleline": "never",
        "multiline": "always"
      }
    }
  ]
}
```

- `singleline` (`"never"` by default) ... the configuration for single-line elements. It's a single-line element if the element does not have attributes or the last attribute is on the same line as the opening bracket.
- `multiline` (`"always"` by default) ... the configuration for multiline elements. It's a multiline element if the last attribute is not on the same line of the opening bracket.
- `selfClosingTag.singleline` ... the configuration for single-line self closing elements.
- `selfClosingTag.multiline` ... the configuration for multiline self closing elements.

Every option can be set to one of the following values:

- `"always"` ... require one line break before the closing bracket.
- `"never"` ... disallow line breaks before the closing bracket.

If `selfClosingTag` is not specified, the `singleline` and `multiline` options are inherited for self-closing tags.

Plus, you can use [`vue/html-indent`](./html-indent.md) rule to enforce indent-level of the closing brackets.

### `"multiline": "never"`

<eslint-code-block fix :rules="{'vue/html-closing-bracket-newline': ['error', { 'multiline': 'never' }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div
    id="foo"
    class="bar">

  <!-- ✗ BAD -->
  <div
    id="foo"
    class="bar"
  >
</template>
```

</eslint-code-block>

### `"selfClosingTag": { "multiline": "always" }`

<eslint-code-block fix :rules="{'vue/html-closing-bracket-newline': ['error', { 'selfClosingTag': {'multiline': 'always'} }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <MyComponent
      :foo="foo"
  />

  <!-- ✗ BAD -->
  <MyComponent
      :foo="foo" />
</template>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v4.1.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/html-closing-bracket-newline.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/html-closing-bracket-newline.js)
