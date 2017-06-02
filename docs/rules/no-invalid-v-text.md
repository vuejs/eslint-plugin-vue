# Disallow invalid v-text directives (no-invalid-v-text)

This rule checks whether every `v-text` directive is valid.

## 📖 Rule Details

This rule reports `v-text` directives if the following cases:

- The directive has that argument. E.g. `<div v-text:aaa></div>`
- The directive has that modifier. E.g. `<div v-text.bbb></div>`
- The directive does not have that attribute value. E.g. `<div v-text></div>`

This rule does not check syntax errors in directives because it's checked by [no-parsing-error] rule.

👎 Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <div v-text></div>
        <div v-text:aaa="foo"></div>
        <div v-text.bbb="foo"></div>
    </div>
</template>
```

👍 Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div v-text="foo"></div>
    </div>
</template>
```

## 🔧 Options

Nothing.

## 👫 Related rules

- [no-parsing-error]


[no-parsing-error]: no-parsing-error.md
