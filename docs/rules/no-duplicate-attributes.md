# disallow duplication of attributes (no-duplicate-attributes)

When duplicate arguments exist, only the last one is valid.
It's possibly mistakes.

## :book: Rule Details

This rule reports duplicate attributes.
`v-bind:foo` directives are handled as the attributes `foo`.

:-1: Examples of **incorrect** code for this rule:

```html
<template>
    <div foo="abc" :foo="def"></div>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
    <div foo="abc"></div>
    <div :foo="def"></div>
</template>
```

## :wrench: Options

`allowCoexistClass` - Enables [`v-bind:class`] directive can coexist with the plain `class` attribute.
`allowCoexistStyle` - Enables [`v-bind:style`] directive can coexist with the plain `style` attribute.

```
'vue/no-duplicate-attributes': [2, {
  allowCoexistClass: Boolean // default: true
  allowCoexistStyle: Boolean, // default: true
}]
```

## TODO: `<div foo foo></div>`

`parse5` remove duplicate attributes on the tokenization phase.
Needs investigation to check.

[`v-bind:class`]: https://vuejs.org/v2/guide/class-and-style.html
[`v-bind:style`]: https://vuejs.org/v2/guide/class-and-style.html
