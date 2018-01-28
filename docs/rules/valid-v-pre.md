# enforce valid `v-pre` directives (vue/valid-v-pre)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every `v-pre` directive is valid.

## :book: Rule Details

This rule reports `v-pre` directives in the following cases:

- The directive has that argument. E.g. `<div v-pre:aaa></div>`
- The directive has that modifier. E.g. `<div v-pre.bbb></div>`
- The directive has that attribute value. E.g. `<div v-pre="ccc"></div>`

:-1: Examples of **incorrect** code for this rule:

```html
<div v-pre:aaa/>
<div v-pre.bbb/>
<div v-pre="ccc"/>
```

:+1: Examples of **correct** code for this rule:

```html
<div v-pre/>
```

## :wrench: Options

Nothing.
