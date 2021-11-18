---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-child-content
description: disallow element's child contents which would be overwritten by a directive like `v-html` or `v-text`
since: v8.1.0
---
# vue/no-child-content

> disallow element's child contents which would be overwritten by a directive like `v-html` or `v-text`

- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

This rule reports child content of elements that have a directive which overwrites that child content. By default, those are `v-html` and `v-text`, additional ones (e.g. [Vue I18n's `v-t` directive](https://vue-i18n.intlify.dev/api/directive.html)) can be configured manually.

<eslint-code-block :rules="{'vue/no-child-content': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div>child content</div>
  <div v-html="replacesChildContent"></div>

  <!-- ✗ BAD -->
  <div v-html="replacesChildContent">child content</div>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-child-content": ["error", {
    "additionalDirectives": ["foo"] // checks v-foo directive
  }]
}
```

- `additionalDirectives` ... An array of additional directives to check, without the `v-` prefix. Empty by default; `v-html` and `v-text` are always checked.

## :books: Further Reading

- [`v-html` directive](https://v3.vuejs.org/api/directives.html#v-html)
- [`v-text` directive](https://v3.vuejs.org/api/directives.html#v-text)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v8.1.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-child-content.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-child-content.js)
