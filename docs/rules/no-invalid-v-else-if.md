# Disallow invalid v-else-if directives (no-invalid-v-else-if)

This rule checks whether every `v-else-if` directive is valid.

## 📖 Rule Details

This rule reports `v-else-if` directives if the following cases:

- The directive has that argument. E.g. `<div v-if="foo"></div><div v-else-if:aaa="bar"></div>`
- The directive has that modifier. E.g. `<div v-if="foo"></div><div v-else-if.bbb="bar"></div>`
- The directive does not have that attribute value. E.g. `<div v-if="foo"></div><div v-else-if></div>`
- The directive is on the elements that the previous element don't have `v-if`/`v-else-if` directives. E.g. `<div v-else-if="bar"></div>`
- The directive is on the elements which have `v-if`/`v-else` directives. E.g. `<div v-if="foo" v-else-if="bar"></div>`

This rule does not check syntax errors in directives because it's checked by [no-parsing-error] rule.

👎 Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <div v-else-if></div>
        <div v-else-if:aaa="foo"></div>
        <div v-else-if.bbb="foo"></div>
    </div>
</template>
```

👍 Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div v-if="foo"></div>
        <div v-else-if="bar"></div>
    </div>
</template>
```

## 🔧 Options

Nothing.

## 👫 Related rules

- [no-invalid-v-if]
- [no-invalid-v-else]
- [no-parsing-error]


[no-invalid-v-if]:   no-invalid-v-if.md
[no-invalid-v-else]: no-invalid-v-else.md
[no-parsing-error]:   no-parsing-error.md
