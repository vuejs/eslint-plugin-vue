---
pageClass: rule-details
sidebarDepth: 0
title: vue/html-comment-indent
description: enforce consistent indentation in HTML comments
---
# vue/html-comment-indent
> enforce consistent indentation in HTML comments

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces a consistent indentation style in HTML comment (`<!-- ... -->`). The default style is 2 spaces.

<eslint-code-block fix :rules="{'vue/html-comment-indent': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <!--
    comment
  -->
  <!--
    comment
    comment
  -->
    <!--
      comment
    -->

  <!-- ✗ BAD -->
  <!--
  comment
      comment
  -->
  <!--
    comment
    -->
    <!--
    comment
  -->
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/html-comment-indent": ["error", type]
}
```

- `type` (`number | "tab"`) ... The type of indentation. Default is `2`. If this is a number, it's the number of spaces for one indent. If this is `"tab"`, it uses one tab for one indent.

### `2`

<eslint-code-block fix :rules="{'vue/html-comment-indent': ['error', 2]}">

```vue
<template>
  <!--
    ✓ GOOD
  -->

  <!--
   ✗ BAD
  -->
</template>
```

</eslint-code-block>

### `4`

<eslint-code-block fix :rules="{'vue/html-comment-indent': ['error', 4]}">

```vue
<template>
  <!--
      ✓ GOOD
  -->

  <!--
    ✗ BAD
  -->
</template>
```

</eslint-code-block>

### `0`

<eslint-code-block fix :rules="{'vue/html-comment-indent': ['error', 0]}">

```vue
<template>
  <!--
  ✓ GOOD
  -->

  <!--
    ✗ BAD
  -->
</template>
```

</eslint-code-block>

### `"tab"`

<eslint-code-block fix :rules="{'vue/html-comment-indent': ['error', 'tab']}">

```vue
<template>
  <!--
  	✓ GOOD
  -->

  <!--
    ✗ BAD
  -->
</template>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/html-comment-indent.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/html-comment-indent.js)
