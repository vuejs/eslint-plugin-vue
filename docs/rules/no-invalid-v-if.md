# Disallow invalid v-if directives (no-invalid-v-if)

This rule checks whether every `v-if` directive is valid.

## :book: Rule Details

This rule reports `v-if` directives in the following cases:

- The directive has that argument. E.g. `<div v-if:aaa="foo"></div>`
- The directive has that modifier. E.g. `<div v-if.bbb="foo"></div>`
- The directive does not have that attribute value. E.g. `<div v-if></div>`
- The directive is on the elements which have `v-else`/`v-else-if` directives. E.g. `<div v-else v-if="foo"></div>`

This rule does not check syntax errors in directives because it's checked by [no-parsing-error] rule.

:-1: Examples of **incorrect** code for this rule:

```html
<template>
    <div v-if="foo">
        <div v-if></div>
        <div v-if:aaa="foo"></div>
        <div v-if.bbb="foo"></div>
        <div v-if="foo" v-else></div>
        <div v-if="foo" v-else-if="bar"></div>
    </div>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div v-if="foo"></div>
        <div v-else-if="bar"></div>
        <div v-else></div>
    </div>
</template>
```

## :wrench: Options

Nothing.

## :couple: Related rules

- [no-invalid-v-else]
- [no-invalid-v-else-if]
- [no-parsing-error]


[no-invalid-v-else]:    no-invalid-v-else.md
[no-invalid-v-else-if]: no-invalid-v-else-if.md
[no-parsing-error]:      no-parsing-error.md
