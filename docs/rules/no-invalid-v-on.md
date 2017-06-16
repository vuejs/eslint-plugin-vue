# Disallow invalid v-on directives (no-invalid-v-on)

This rule checks whether every `v-on` directive is valid.

## 📖 Rule Details

This rule reports `v-on` directives if the following cases:

- The directive does not have that event name. E.g. `<div v-on="foo"></div>`
- The directive has invalid modifiers. E.g. `<div v-on:click.bbb="foo"></div>`
- The directive does not have that attribute value. E.g. `<div v-on:click></div>`

This rule does not check syntax errors in directives because it's checked by [no-parsing-error] rule.

👎 Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <div v-on="foo"></div>
        <div v-on:click="foo"></div>
        <div v-on:click.bbb="foo"></div>
    </div>
</template>
```

👍 Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div v-on:click="foo"></div>
        <div @click="foo"></div>
        <div @click.left.prevent="foo"></div>
    </div>
</template>
```

## 🔧 Options

Nothing.

## 👫 Related rules

- [no-parsing-error]


[no-parsing-error]: no-parsing-error.md
