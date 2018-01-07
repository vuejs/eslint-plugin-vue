# disallow `key` attribute on `<template>` (vue/no-template-key)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

Vue.js disallows `key` attribute on `<template>` elements.

## :book: Rule Details

This rule reports the `<template>` elements which have `key` attribute.

:-1: Examples of **incorrect** code for this rule:

```html
<template key="foo"> ... </template>
<template v-bind:key="bar"> ... </template>
<template :key="baz"> ... </template>
```

:+1: Examples of **correct** code for this rule:

```html
<div key="foo"> ... </div>
<template> ... </template>
```

## :wrench: Options

Nothing.
