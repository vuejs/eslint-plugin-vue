# disallow mustaches in `<textarea>` (vue/no-textarea-mustache)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

> Interpolation on textareas (`<textarea>{{text}}</textarea>`) won't work. Use `v-model` instead.
>
> https://vuejs.org/v2/guide/forms.html#Multiline-text

## :book: Rule Details

This rule reports mustaches in `<textarea>`.

<eslint-code-block :rules="{'vue/no-textarea-mustache': ['error']}">
```
<template>
  <!-- ✓ GOOD -->
  <textarea v-model="message" />

  <!-- ✗ BAD -->
  <textarea>{{ message }}</textarea>
</template>
```
</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further reading

- [Guide - Forms / Multiline text](https://vuejs.org/v2/guide/forms.html#Multiline-text)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-textarea-mustache.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-textarea-mustache.js)
