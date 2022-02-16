---
pageClass: rule-details
sidebarDepth: 0
title: vue/max-attributes-per-line
description: enforce the maximum number of attributes per line
since: v3.12.0
---
# vue/max-attributes-per-line

> enforce the maximum number of attributes per line

- :gear: This rule is included in all of `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

Limits the maximum number of attributes/properties per line to improve readability.

## :book: Rule Details

This rule aims to enforce a number of attributes per line in templates.
It checks all the elements in a template and verifies that the number of attributes per line does not exceed the defined maximum.
An attribute is considered to be in a new line when there is a line break between two attributes.

There is a configurable number of attributes that are acceptable in one-line case (default 1), as well as how many attributes are acceptable per line in multi-line case (default 1).

<eslint-code-block fix :rules="{'vue/max-attributes-per-line': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <MyComponent lorem="1"/>
  <MyComponent
    lorem="1"
    ipsum="2"
  />
  <MyComponent
    lorem="1"
    ipsum="2"
    dolor="3"
  />

  <!-- ✗ BAD -->
  <MyComponent lorem="1" ipsum="2"/>
  <MyComponent
    lorem="1" ipsum="2"
  />
  <MyComponent
    lorem="1" ipsum="2"
    dolor="3"
  />
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/max-attributes-per-line": ["error", {
    "singleline": {
      "max": 1
    },      
    "multiline": {
      "max": 1
    }
  }]
}
```

- `singleline.max` (`number`) ... The number of maximum attributes per line when the opening tag is in a single line. Default is `1`. This can be `{ singleline: 1 }` instead of `{ singleline: { max: 1 }}`.
- `multiline.max` (`number`) ... The max number of attributes per line when the opening tag is in multiple lines. Default is `1`. This can be `{ multiline: 1 }` instead of `{ multiline: { max: 1 }}`.

### `"singleline": 3`

<eslint-code-block fix :rules="{'vue/max-attributes-per-line': ['error', {singleline: 3}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <MyComponent lorem="1" ipsum="2" dolor="3" />

  <!-- ✗ BAD -->
  <MyComponent lorem="1" ipsum="2" dolor="3" sit="4" />
</template>
```

</eslint-code-block>

### `"multiline": 2`

<eslint-code-block fix :rules="{'vue/max-attributes-per-line': ['error', {multiline: 2}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <MyComponent
    lorem="1" ipsum="2"
    dolor="3"
  />

  <!-- ✗ BAD -->
  <MyComponent
    lorem="1" ipsum="2" dolor="3"
    sit="4"
  />
</template>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/first-attribute-linebreak](./first-attribute-linebreak.md)

## :books: Further Reading

- [Style guide - Multi attribute elements](https://vuejs.org/style-guide/rules-strongly-recommended.html#multi-attribute-elements)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v3.12.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/max-attributes-per-line.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/max-attributes-per-line.js)
