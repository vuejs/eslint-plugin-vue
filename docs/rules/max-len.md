---
pageClass: rule-details
sidebarDepth: 0
title: vue/max-len
description: enforce a maximum line length
---
# vue/max-len
> enforce a maximum line length

## :book: Rule Details

This rule enforces a maximum line length to increase code readability and maintainability.
This rule is the similar rule as core [max-len] rule but it applies to the source code in `.vue`.

<eslint-code-block :rules="{'vue/max-len': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </div>

  <!-- ✗ BAD -->
  <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </div>
  <div>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </div>
</template>

<script>
/* ✓ GOOD */
var foo = {
  "bar": "This is a bar.",
  "baz": { "qux": "This is a qux" },
  "easier": "to read"
};

/* ✗ BAD */
var foo = { "bar": "This is a bar.", "baz": { "qux": "This is a qux" }, "difficult": "to read" };
</script>

<style>
/* ignore */
.ignore-stylesheet .blocks-other-than-script-and-template-are-ignored .this-line-has-a-length-of-100
{}
</style>
```

</eslint-code-block>

## :wrench: Options

```js
{
    "vue/max-len": ["error", {
        "code": 80,
        "template": 80,
        "tabWidth": 2,
        "comments": 80,
        "ignorePattern": "",
        "ignoreComments": false,
        "ignoreTrailingComments": false,
        "ignoreUrls": false,
        "ignoreStrings": false,
        "ignoreTemplateLiterals": false,
        "ignoreRegExpLiterals": false,
        "ignoreHTMLAttributeValues": false,
        "ignoreHTMLTextContents": false,
    }]
}
```

- `code` ... enforces a maximum line length. default `80`
- `template` ... enforces a maximum line length for `<template>`. defaults to value of `code`
- `tabWidth` ... specifies the character width for tab characters. default `2`
- `comments` ... enforces a maximum line length for comments. defaults to value of `code`
- `ignorePattern` ... ignores lines matching a regular expression. can only match a single line and need to be double escaped when written in YAML or JSON
- `ignoreComments` ... if `true`, ignores all trailing comments and comments on their own line. default `false`
- `ignoreTrailingComments` ... if `true`, ignores only trailing comments. default `false`
- `ignoreUrls` ... if `true`, ignores lines that contain a URL. default `false`
- `ignoreStrings` ... if `true`, ignores lines that contain a double-quoted or single-quoted string. default `false`
- `ignoreTemplateLiterals` ... if `true`, ignores lines that contain a template literal. default `false`
- `ignoreRegExpLiterals` ... if `true`, ignores lines that contain a RegExp literal. default `false`
- `ignoreHTMLAttributeValues` ... if `true`, ignores lines that contain a HTML attribute value. default `false`
- `ignoreHTMLTextContents` ... if `true`, ignores lines that contain a HTML text content. default `false`

### `"code": 40`

<eslint-code-block :rules="{'vue/max-len': ['error', {code: 40}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div>line length is 40 ........ </div>

  <!-- ✗ BAD -->
  <div>line length is 50 .................. </div>
</template>

<script>
/* ✓ GOOD */
var foo = ['line', 'length', 'is', '40']

/* ✗ BAD */
var foo = ['line', 'length', 'is', '50', '......']
</script>
```

</eslint-code-block>


### `"template": 120`

<eslint-code-block :rules="{'vue/max-len': ['error', {template: 120}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div>line length is 120 ....................................................................................... </div>

  <!-- ✗ BAD -->
  <div>line length is 121 ........................................................................................ </div>
</template>

<script>
/* ✗ BAD */
var foo = ['line', 'length', 'is', '81', '......', '......', '......', '......'];
</script>
```

</eslint-code-block>

### `"comments": 65`

<eslint-code-block :rules="{'vue/max-len': ['error', {comments: 65}]}">

```vue
<template>
<!-- ✓ GOOD -->
<!--
  This is a comment that does not violates
  the maximum line length we have specified
-->

<!-- ✗ BAD -->
<!--
  This is a comment that violates the maximum line length we have specified
-->
</template>

<script>
/* ✓ GOOD */
/**
 * This is a comment that does not violates
 * the maximum line length we have specified
 */

/* ✗ BAD */
/**
 * This is a comment that violates the maximum line length we have specified
 */
</script>
```

</eslint-code-block>

### `"ignoreComments": true`

<eslint-code-block :rules="{'vue/max-len': ['error', {ignoreComments: true}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <!-- This is a really really really really really really really really really long comment -->
</template>

<script>
/* ✓ GOOD */
/**
 * This is a really really really really really really really really really long comment
 */
</script>
```

</eslint-code-block>

### `"ignoreTrailingComments": true`

<eslint-code-block :rules="{'vue/max-len': ['error', {ignoreTrailingComments: true}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div /><!-- This is a really really really really really really really really long comment -->

  <!-- ✗ BAD -->
  <!-- This is a really really really really really really really really long comment -->
</template>

<script>
/* ✓ GOOD */
var foo = 'bar'; // This is a really really really really really really really really long comment

/* ✗ BAD */
// This is a really really really really really really really really long comment
</script>
```

</eslint-code-block>

### `"ignoreUrls": true`

<eslint-code-block :rules="{'vue/max-len': ['error', {ignoreUrls: true}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div style="background-image: url('https://www.example.com/really/really/really/really/really/really/really/long')" />
</template>

<script>
/* ✓ GOOD */
var url = 'https://www.example.com/really/really/really/really/really/really/really/long';
</script>
```

</eslint-code-block>

### `"ignoreStrings": true`

<eslint-code-block :rules="{'vue/max-len': ['error', {ignoreStrings: true}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div :title="'this is a really really really really really really long string!'" />

  <!-- ✗ BAD -->
  <div title="this is a really really really really really really long attribute value!" />
  <div>this is a really really really really really really really long text content!</div>
</template>

<script>
/* ✓ GOOD */
var longString = 'this is a really really really really really really long string!';
</script>
```

</eslint-code-block>

### `"ignoreTemplateLiterals": true`

<eslint-code-block :rules="{'vue/max-len': ['error', {ignoreTemplateLiterals: true}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div :title="`this is a really really really really really long template literal!`" />
</template>

<script>
/* ✓ GOOD */
var longTemplateLiteral = `this is a really really really really really long template literal!`;
</script>
```

</eslint-code-block>

### `"ignoreRegExpLiterals": true`

<eslint-code-block :rules="{'vue/max-len': ['error', {ignoreRegExpLiterals: true}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div :class="{
    foo: /this is a really really really really really long regular expression!/.test(bar)
  }" />
</template>

<script>
/* ✓ GOOD */
var longRegExpLiteral = /this is a really really really really really long regular expression!/;
</script>
```

</eslint-code-block>

### `"ignoreHTMLAttributeValues": true`

<eslint-code-block :rules="{'vue/max-len': ['error', {ignoreHTMLAttributeValues: true}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div title="this is a really really really really really really long attribute value!" />

  <!-- ✗ BAD -->
  <div :title="'this is a really really really really really really long string!'" />
</template>
```

</eslint-code-block>

### `"ignoreHTMLTextContents": true`

<eslint-code-block :rules="{'vue/max-len': ['error', {ignoreHTMLTextContents: true}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div>this is a really really really really really really really long text content!</div>
</template>
```

</eslint-code-block>

## :books: Further Reading

- [max-len]

[max-len]: https://eslint.org/docs/rules/max-len

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/max-len.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/max-len.js)

<sup>Taken with ❤️ [from ESLint core](https://eslint.org/docs/rules/max-len)</sup>
