# disallow use of v-html to prevent XSS attack (vue/no-v-html)

This rule reports use of `v-html` directive in order to reduce the risk of injecting potentially unsafe / unescaped html into the browser leading to Cross Side Scripting (XSS) attacks.

## :book: Rule Details

This rule reports all uses of `v-html` to help prevent XSS attacks.

This rule does not check syntax errors in directives because it's checked by no-parsing-error rule.

:-1: Examples of **incorrect** code for this rule:

```html
<template>
    <div v-html="someHTML"></div>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
    <div>{{someHTML}}</div>
</template>
```

## :wrench: Options

Nothing.

## When Not To Use It

If you are certain the content passed `to v-html` is sanitized HTML you can disable this rule.

## Related links

- [XSS in Vue.js](https://blog.sqreen.io/xss-in-vue-js/)
