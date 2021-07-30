---
pageClass: rule-details
sidebarDepth: 0
title: vue/block-lang
description: disallow use other than available `lang`
since: v7.15.0
---
# vue/block-lang

> disallow use other than available `lang`

## :book: Rule Details

This rule disallows the use of languages other than those available in the your application for the lang attribute of block elements.

## :wrench: Options

```json
{
  "vue/block-lang": ["error",
    {
      "script": {
        "lang": "ts"
      }
    }
  ]
}
```

<eslint-code-block :rules="{'vue/block-lang': ['error', { script: { lang: 'ts' } }]}">

```vue
<!-- ✓ GOOD -->
<script lang="ts">
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/block-lang': ['error', { script: { lang: 'ts' } }]}">

```vue
<!-- ✗ BAD -->
<script>
</script>
```

</eslint-code-block>

Specify the block name for the key of the option object.  
You can use the object as a value and use the following properties:

- `lang` ... Specifies the available value for the `lang` attribute of the block. If multiple languages are available, specify them as an array. If you do not specify it, will disallow any language.
- `allowNoLang` ... If `true`, allows the `lang` attribute not to be specified (allows the use of the default language of block).

::: warning Note
If the default language is specified for `lang` option of `<template>`, `<style>` and `<script>`, it will be enforced to not specify `lang` attribute.  
This is to prevent unintended problems with [Vetur](https://vuejs.github.io/vetur/).

See also [Vetur - Syntax Highlighting](https://vuejs.github.io/vetur/guide/highlighting.html).
:::

### `{ script: { lang: 'js' } }`

Same as `{ script: { allowNoLang: true } }`.

<eslint-code-block :rules="{'vue/block-lang': ['error', { script: { lang: 'js' } }]}">

```vue
<!-- ✓ GOOD -->
<script>
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/block-lang': ['error', { script: { lang: 'js' } }]}">

```vue
<!-- ✗ BAD -->
<script lang="js">
</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.15.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/block-lang.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/block-lang.js)
