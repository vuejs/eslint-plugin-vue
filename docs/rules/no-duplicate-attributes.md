# Disallow duplicate arguments (no-duplicate-attributes)

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

Nothing.

## TODO: `<div foo foo></div>`

`parse5` remove duplicate attributes on the tokenization phase.
Needs investigation to check.
