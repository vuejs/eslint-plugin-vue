# Disallow invalid v-bind directives (no-invalid-v-bind)

This rule checks whether every `v-bind` directive is valid.

## 📖 Rule Details

This rule reports `v-bind` directives if the following cases:

- The directive does not have that attribute value. E.g. `<div v-bind:aaa></div>`
- The directive has invalid modifiers. E.g. `<div v-bind:aaa.bbb="ccc"></div>`

This rule does not report `v-bind` directives which do not have their argument (E.g. `<div v-bind="aaa"></div>`) because it's valid if the attribute value is an object.

This rule does not check syntax errors in directives because it's checked by [no-parsing-error] rule.

👎 Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <div v-bind></div>
        <div :aaa></div>
        <div v-bind:aaa.bbb="foo"></div>
    </div>
</template>
```

👍 Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div v-bind="foo"></div>
        <div v-bind:aaa="foo"></div>
        <div :aaa="foo"></div>
        <div :aaa.prop="foo"></div>
    </div>
</template>
```

## 🔧 Options

Nothing.

## 👫 Related rules

- [no-parsing-error]


[no-parsing-error]: no-parsing-error.md
