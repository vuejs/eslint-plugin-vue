# disallow mustaches in `<textarea>` (no-textarea-mustache)

- :white_check_mark: The `"extends": "plugin:vue/recommended"` property in a configuration file enables this rule.

> Interpolation on textareas (`<textarea>{{text}}</textarea>`) won't work. Use `v-model` instead.
>
> https://vuejs.org/v2/guide/forms.html#Multiline-text

## :book: Rule Details

This rule reports mustaches in `<textarea>`.

:-1: Examples of **incorrect** code for this rule:

```html
<template>
    <textarea>{{message}}</textarea>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
    <textarea v-model="message"></textarea>
</template>
```

## :wrench: Options

Nothing.
