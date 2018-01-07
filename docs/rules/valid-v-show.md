# enforce valid `v-show` directives (vue/valid-v-show)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every `v-show` directive is valid.

## :book: Rule Details

This rule reports `v-show` directives in the following cases:

- The directive has that argument. E.g. `<div v-show:aaa></div>`
- The directive has that modifier. E.g. `<div v-show.bbb></div>`
- The directive does not have that attribute value. E.g. `<div v-show></div>`

This rule does not check syntax errors in directives because it's checked by [no-parsing-error] rule.

:-1: Examples of **incorrect** code for this rule:

```html
<div v-show/>
<div v-show:aaa="foo"/>
<div v-show.bbb="foo"/>
```

:+1: Examples of **correct** code for this rule:

```html
<div v-show="foo"/>
```

## :wrench: Options

Nothing.

## :couple: Related rules

- [no-parsing-error]


[no-parsing-error]: no-parsing-error.md
