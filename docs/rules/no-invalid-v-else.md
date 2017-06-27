# Disallow invalid v-else directives (no-invalid-v-else)

This rule checks whether every `v-else` directive is valid.

## 📖 Rule Details

This rule reports `v-else` directives in the following cases:

- The directive has that argument. E.g. `<div v-if="foo"></div><div v-else:aaa></div>`
- The directive has that modifier. E.g. `<div v-if="foo"></div><div v-else.bbb></div>`
- The directive has that attribute value. E.g. `<div v-if="foo"></div><div v-else="bar"></div>`
- The directive is on the elements that the previous element don't have `v-if`/`v-if-else` directives. E.g. `<div v-else></div>`
- The directive is on the elements which have `v-if`/`v-if-else` directives. E.g. `<div v-if="foo" v-else></div>`

👎 Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <div v-else="foo"></div>
        <div v-else:aaa></div>
        <div v-else.bbb></div>
    </div>
</template>
```

👍 Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div v-if="foo"></div>
        <div v-else></div>
    </div>
</template>
```

## 🔧 Options

Nothing.

## 👫 Related rules

- [no-invalid-v-if]
- [no-invalid-v-else]


[no-invalid-v-if]:   no-invalid-v-if.md
[no-invalid-v-else]: no-invalid-v-else.md
