# Enforce valid `v-once` directives (valid-v-once)

This rule checks whether every `v-once` directive is valid.

## :book: Rule Details

This rule reports `v-once` directives in the following cases:

- The directive has that argument. E.g. `<div v-once:aaa></div>`
- The directive has that modifier. E.g. `<div v-once.bbb></div>`
- The directive has that attribute value. E.g. `<div v-once="ccc"></div>`

:-1: Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <div v-once:aaa></div>
        <div v-once.bbb></div>
        <div v-once="ccc"></div>
    </div>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div v-once></div>
    </div>
</template>
```

## :wrench: Options

Nothing.
