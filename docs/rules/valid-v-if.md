# enforce valid `v-if` directives (vue/valid-v-if)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every `v-if` directive is valid.

## :book: Rule Details

This rule reports `v-if` directives in the following cases:

- The directive has that argument. E.g. `<div v-if:aaa="foo"></div>`
- The directive has that modifier. E.g. `<div v-if.bbb="foo"></div>`
- The directive does not have that attribute value. E.g. `<div v-if></div>`
- The directive is on the elements which have `v-else`/`v-else-if` directives. E.g. `<div v-else v-if="foo"></div>`

This rule does not check syntax errors in directives because it's checked by [no-parsing-error] rule.

:-1: Examples of **incorrect** code for this rule:

```html
<div v-if/>
<div v-if:aaa="foo"/>
<div v-if.bbb="foo"/>
<div
  v-if="foo"
  v-else
/>
<div
  v-if="foo"
  v-else-if="bar"
/>
```

:+1: Examples of **correct** code for this rule:

```html
<div v-if="foo"/>
<div v-else-if="bar"/>
<div v-else/>
```

## :wrench: Options

Nothing.

## :couple: Related rules

- [valid-v-else]
- [valid-v-else-if]
- [no-parsing-error]


[valid-v-else]:    valid-v-else.md
[valid-v-else-if]: valid-v-else-if.md
[no-parsing-error]:      no-parsing-error.md
