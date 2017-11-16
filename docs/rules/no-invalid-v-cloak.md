# disallow invalid `v-cloak` directives (no-invalid-v-cloak)

- :warning: This rule was **deprecated** and replaced by [valid-v-cloak](valid-v-cloak.md) rule.

This rule checks whether every `v-cloak` directive is valid.

## :book: Rule Details

This rule reports `v-cloak` directives in the following cases:

- The directive has that argument. E.g. `<div v-cloak:aaa></div>`
- The directive has that modifier. E.g. `<div v-cloak.bbb></div>`
- The directive has that attribute value. E.g. `<div v-cloak="ccc"></div>`

:-1: Examples of **incorrect** code for this rule:

```html
<div v-cloak:aaa/>
<div v-cloak.bbb/>
<div v-cloak="ccc"/>
```

:+1: Examples of **correct** code for this rule:

```html
<div v-cloak/>
```

## :wrench: Options

Nothing.
