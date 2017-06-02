# Disallow invalid v-once directives (no-invalid-v-once)

This rule checks whether every `v-once` directive is valid.

## 📖 Rule Details

This rule reports `v-once` directives if the following cases:

- The directive has that argument. E.g. `<div v-once:aaa></div>`
- The directive has that modifier. E.g. `<div v-once.bbb></div>`
- The directive has that attribute value. E.g. `<div v-once="ccc"></div>`

👎 Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <div v-once:aaa></div>
        <div v-once.bbb></div>
        <div v-once="ccc"></div>
    </div>
</template>
```

👍 Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div v-once></div>
    </div>
</template>
```

## 🔧 Options

Nothing.
