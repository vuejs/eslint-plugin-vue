# Disallow invalid v-show directives (no-invalid-v-show)

This rule checks whether every `v-show` directive is valid.

## 📖 Rule Details

This rule reports `v-show` directives if the following cases:

- The directive has that argument. E.g. `<div v-show:aaa></div>`
- The directive has that modifier. E.g. `<div v-show.bbb></div>`
- The directive does not have that attribute value. E.g. `<div v-show></div>`

This rule does not check syntax errors in directives because it's checked by [no-parsing-error] rule.

👎 Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <div v-show></div>
        <div v-show:aaa="foo"></div>
        <div v-show.bbb="foo"></div>
    </div>
</template>
```

👍 Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div v-show="foo"></div>
    </div>
</template>
```

## 🔧 Options

Nothing.

## 👫 Related rules

- [no-parsing-error]


[no-parsing-error]: no-parsing-error.md
