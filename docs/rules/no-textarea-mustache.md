# disallow mustaches in `<textarea>` (vue/no-textarea-mustache)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

> Interpolation on textareas (`<textarea>{{text}}</textarea>`) won't work. Use `v-model` instead.
>
> https://vuejs.org/v2/guide/forms.html#Multiline-text

## :book: Rule Details

This rule reports mustaches in `<textarea>`.

:-1: Examples of **incorrect** code for this rule:

```html
<textarea>{{ message }}</textarea>
```

:+1: Examples of **correct** code for this rule:

```html
<textarea v-model="message"/>
```

## :wrench: Options

Nothing.

## Related links

- [Guide - Forms / Multiline text](https://vuejs.org/v2/guide/forms.html#Multiline-text)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-textarea-mustache.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-textarea-mustache.js)
