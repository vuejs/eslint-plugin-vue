# enforce valid `v-once` directives (vue/valid-v-once)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every `v-once` directive is valid.

## :book: Rule Details

This rule reports `v-once` directives in the following cases:

- The directive has that argument. E.g. `<div v-once:aaa></div>`
- The directive has that modifier. E.g. `<div v-once.bbb></div>`
- The directive has that attribute value. E.g. `<div v-once="ccc"></div>`

:-1: Examples of **incorrect** code for this rule:

```html
<div v-once:aaa/>
<div v-once.bbb/>
<div v-once="ccc"/>
```

:+1: Examples of **correct** code for this rule:

```html
<div v-once/>
```

## :wrench: Options

Nothing.
