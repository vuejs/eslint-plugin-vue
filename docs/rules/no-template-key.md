# Disallow `key` attribute on `<template>` (no-template-key)

Vue.js disallows `key` attribute on `<template>` elements.

## :book: Rule Details

This rule reports the `<template>` elements which have `key` attribute.

:-1: Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <template key="x"></template>
        <template v-bind:key="y"></template>
        <template :key="z"></template>
    </div>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div key="x"></div>
        <template></template>
    </div>
</template>
```

## :wrench: Options

Nothing.
