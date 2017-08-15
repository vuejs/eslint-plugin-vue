# Disallow usage of `this` in template. (no-this-in-template)

This rule reports expresions that contain `this` keyword in expressions

## :book: Rule Details

:-1: Examples of **incorrect** code for this rule:

```html
<template>
     <a :href="this.link">{{this.text}}</a>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
     <a :href="link">{{text}}</a>
</template>
```

## :wrench: Options

Nothing.
