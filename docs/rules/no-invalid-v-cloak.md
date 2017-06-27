# Disallow invalid v-cloak directives (no-invalid-v-cloak)

This rule checks whether every `v-cloak` directive is valid.

## 📖 Rule Details

This rule reports `v-cloak` directives in the following cases:

- The directive has that argument. E.g. `<div v-cloak:aaa></div>`
- The directive has that modifier. E.g. `<div v-cloak.bbb></div>`
- The directive has that attribute value. E.g. `<div v-cloak="ccc"></div>`

👎 Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <div v-cloak:aaa></div>
        <div v-cloak.bbb></div>
        <div v-cloak="ccc"></div>
    </div>
</template>
```

👍 Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div v-cloak></div>
    </div>
</template>
```

## 🔧 Options

Nothing.
