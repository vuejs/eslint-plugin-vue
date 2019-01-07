---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-v-html
description: disallow use of v-html to prevent XSS attack
---
# vue/no-v-html
> disallow use of v-html to prevent XSS attack

- :gear: This rule is included in `"plugin:vue/recommended"`.

## :book: Rule Details

This rule reports all uses of `v-html` directive in order to reduce the risk of injecting potentially unsafe / unescaped html into the browser leading to Cross-Site Scripting (XSS) attacks.

<eslint-code-block :rules="{'vue/no-v-html': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div>{{ someHTML }}</div>

  <!-- ✗ BAD -->
  <div v-html="someHTML"></div>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mute: When Not To Use It

If you are certain the content passed to `v-html` is sanitized HTML you can disable this rule.

## :books: Further reading

- [XSS in Vue.js](https://blog.sqreen.io/xss-in-vue-js/)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-v-html.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-v-html.js)
