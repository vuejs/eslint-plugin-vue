# enforce valid `v-pre` directives (valid-v-pre)

This rule checks whether every `v-pre` directive is valid.

## :book: Rule Details

This rule reports `v-pre` directives in the following cases:

- The directive has that argument. E.g. `<div v-pre:aaa></div>`
- The directive has that modifier. E.g. `<div v-pre.bbb></div>`
- The directive has that attribute value. E.g. `<div v-pre="ccc"></div>`

:-1: Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <div v-pre:aaa></div>
        <div v-pre.bbb></div>
        <div v-pre="ccc"></div>
    </div>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div v-pre></div>
    </div>
</template>
```

## :wrench: Options

Nothing.
