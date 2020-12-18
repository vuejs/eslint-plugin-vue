---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-irregular-whitespace
description: disallow irregular whitespace
---
# vue/no-irregular-whitespace
> disallow irregular whitespace

## :book: Rule Details

`vue/no-irregular-whitespace` rule is aimed at catching invalid whitespace that is not a normal tab and space. Some of these characters may cause issues in modern browsers and others will be a debugging issue to spot.
`vue/no-irregular-whitespace` rule is the similar rule as core [no-irregular-whitespace] rule but it applies to the source code in .vue.

<eslint-code-block :rules="{'vue/no-irregular-whitespace': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div class="foo bar" />
  <!-- ✗ BAD -->
  <div class="foobar" />
  <!--           ^ LINE TABULATION (U+000B) -->
</template>
<script>
/* ✓ GOOD */
var foo = bar;
/* ✗ BAD */
var foo =bar;
//       ^ LINE TABULATION (U+000B)
</script>
```

</eslint-code-block>

## :wrench: Options

```js
{
    "vue/no-irregular-whitespace": ["error", {
        "skipStrings": true,
        "skipComments": false,
        "skipRegExps": false,
        "skipTemplates": false,
        "skipHTMLAttributeValues": false,
        "skipHTMLTextContents": false
    }]
}
```

- `skipStrings`: if `true`, allows any whitespace characters in string literals. default `true`
- `skipComments`: if `true`, allows any whitespace characters in comments. default `false`
- `skipRegExps`: if `true`, allows any whitespace characters in regular expression literals. default `false`
- `skipTemplates`: if `true`, allows any whitespace characters in template literals. default `false`
- `skipHTMLAttributeValues`: if `true`, allows any whitespace characters in HTML attribute values. default `false`
- `skipHTMLTextContents`: if `true`, allows any whitespace characters in HTML text contents. default `false`

### `"skipStrings": true` (default)

<eslint-code-block :rules="{'vue/no-irregular-whitespace': ['error', {skipStrings: true}]}">

```vue
<script>
/* ✓ GOOD */
var foo = ''
//         ^ LINE TABULATION (U+000B)
</script>
```

</eslint-code-block>

### `"skipStrings": false`

<eslint-code-block :rules="{'vue/no-irregular-whitespace': ['error', {skipStrings: false}]}">

```vue
<script>
/* ✗ BAD */
var foo = ''
//         ^ LINE TABULATION (U+000B)
</script>
```

</eslint-code-block>

### `"skipComments": true`

<eslint-code-block :rules="{'vue/no-irregular-whitespace': ['error', {skipComments: true}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <!-- []< LINE TABULATION (U+000B) -->
</template>
<script>
/* ✓ GOOD */
// []< LINE TABULATION (U+000B)
/* []< LINE TABULATION (U+000B) */
</script>
```

</eslint-code-block>

### `"skipRegExps": true`

<eslint-code-block :rules="{'vue/no-irregular-whitespace': ['error', {skipRegExps: true}]}">

```vue
<script>
/* ✓ GOOD */
var foo = //
//         ^ LINE TABULATION (U+000B)
</script>
```

</eslint-code-block>

### `"skipTemplates": true`

<eslint-code-block :rules="{'vue/no-irregular-whitespace': ['error', {skipTemplates: true}]}">

```vue
<script>
/* ✓ GOOD */
var foo = ``
//         ^ LINE TABULATION (U+000B)
</script>
```

</eslint-code-block>

### `"skipHTMLAttributeValues": true`

<eslint-code-block :rules="{'vue/no-irregular-whitespace': ['error', {skipHTMLAttributeValues: true}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div class="foobar" />
  <!--           ^ LINE TABULATION (U+000B) -->
</template>
```

</eslint-code-block>

### `"skipHTMLTextContents": true`

<eslint-code-block :rules="{'vue/no-irregular-whitespace': ['error', {skipHTMLTextContents: true}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div></div>
  <!-- ^ LINE TABULATION (U+000B) -->
</template>
```

</eslint-code-block>

## :books: Further Reading

- [no-irregular-whitespace]

[no-irregular-whitespace]: https://eslint.org/docs/rules/no-irregular-whitespace

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-irregular-whitespace.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-irregular-whitespace.js)

<sup>Taken with ❤️ [from ESLint core](https://eslint.org/docs/rules/no-irregular-whitespace)</sup>
