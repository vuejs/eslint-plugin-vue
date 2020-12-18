---
pageClass: rule-details
sidebarDepth: 0
title: vue/html-comment-content-spacing
description: enforce unified spacing in HTML comments
---
# vue/html-comment-content-spacing
> enforce unified spacing in HTML comments

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule will enforce consistency of spacing after the `<!--` and before the `-->` of comment. It also provides several exceptions for various documentation styles.

Whitespace after the `<!--` and before the `-->` makes it easier to read text in comments.

<eslint-code-block fix :rules="{'vue/html-comment-content-spacing': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <!-- comment -->
  <!--
    comment
  -->

  <!--✗ BAD-->
  <!--comment-->
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/html-comment-content-spacing": ["error",
    "always" | "never",
    {
      "exceptions": []
    }
  ]
}
```

- The first is a string which be either `"always"` or `"never"`. The default is `"always"`.
    - `"always"` (default) ... there must be at least one whitespace at after the `<!--` and before the `-->`.
    - `"never"` ... there should be no whitespace at after the `<!--` and before the `-->`.


- This rule can also take a 2nd option, an object with the following key: `"exceptions"`.
    - The `"exceptions"` value is an array of string patterns which are considered exceptions to the rule.
    Please note that exceptions are ignored if the first argument is `"never"`.

    ```json
    "vue/html-comment-content-spacing": ["error", "always", { "exceptions": ["*"] }]
    ```

### `"always"`

<eslint-code-block fix :rules="{'vue/html-comment-content-spacing': ['error', 'always']}">

```vue
<template>
  <!-- ✓ GOOD -->

  <!--✗ BAD-->
</template>
```

</eslint-code-block>

### `"never"`

<eslint-code-block fix :rules="{'vue/html-comment-content-spacing': ['error', 'never']}">

```vue
<template>
  <!--✓ GOOD-->

  <!-- ✗ BAD -->
  <!--       comment      -->
</template>
```

</eslint-code-block>

### `"always", { "exceptions": ["*"] }`

<eslint-code-block fix :rules="{'vue/html-comment-content-spacing': ['error', 'always', { 'exceptions': ['*'] }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <!--*******
    comment
    *******-->

  <!--*******✗ BAD*******-->
</template>
```

</eslint-code-block>

## :couple: Related Rules

- [spaced-comment](https://eslint.org/docs/rules/spaced-comment)
- [vue/html-comment-content-newline](./html-comment-content-newline.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/html-comment-content-spacing.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/html-comment-content-spacing.js)
