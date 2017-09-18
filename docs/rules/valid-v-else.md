# enforce valid `v-else` directives (valid-v-else)

- :white_check_mark: The `"extends": "plugin:vue/recommended"` property in a configuration file enables this rule.

This rule checks whether every `v-else` directive is valid.

## :book: Rule Details

This rule reports `v-else` directives in the following cases:

- The directive has that argument. E.g. `<div v-if="foo"></div><div v-else:aaa></div>`
- The directive has that modifier. E.g. `<div v-if="foo"></div><div v-else.bbb></div>`
- The directive has that attribute value. E.g. `<div v-if="foo"></div><div v-else="bar"></div>`
- The directive is on the elements that the previous element don't have `v-if`/`v-if-else` directives. E.g. `<div v-else></div>`
- The directive is on the elements which have `v-if`/`v-if-else` directives. E.g. `<div v-if="foo" v-else></div>`

:-1: Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <div v-else="foo"></div>
        <div v-else:aaa></div>
        <div v-else.bbb></div>
    </div>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div v-if="foo"></div>
        <div v-else></div>
    </div>
</template>
```

## :wrench: Options

Nothing.

## :couple: Related rules

- [valid-v-if]
- [valid-v-else-if]
- [no-parsing-error]


[valid-v-if]:       valid-v-if.md
[valid-v-else-if]:  valid-v-else-if.md
[no-parsing-error]:      no-parsing-error.md
