# disallow unused variable definitions of v-for directives or scope attributes (vue/no-unused-vars)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule report variable definitions of v-for directives or scope attributes if those are not used.

## :book: Rule Details

:-1: Examples of **incorrect** code for this rule:

```html
<template>
  <ol v-for="i in 5"><!-- "i" is defined but never used. -->
    <li>item</li>
  </ol>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
  <ol v-for="i in 5">
    <li>{{i}}</li><!-- "i" is defined and used. -->
  </ol>
</template>
```

## :wrench: Options

Nothing.
