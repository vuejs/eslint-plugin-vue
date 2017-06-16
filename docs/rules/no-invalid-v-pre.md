# Disallow invalid v-pre directives (no-invalid-v-pre)

This rule checks whether every `v-pre` directive is valid.

## 📖 Rule Details

This rule reports `v-pre` directives if the following cases:

- The directive has that argument. E.g. `<div v-pre:aaa></div>`
- The directive has that modifier. E.g. `<div v-pre.bbb></div>`
- The directive has that attribute value. E.g. `<div v-pre="ccc"></div>`

👎 Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <div v-pre:aaa></div>
        <div v-pre.bbb></div>
        <div v-pre="ccc"></div>
    </div>
</template>
```

👍 Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div v-pre></div>
    </div>
</template>
```

## 🔧 Options

Nothing.
