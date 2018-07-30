# enforce valid `v-else` directives (vue/valid-v-else)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every `v-else` directive is valid.

## :book: Rule Details

This rule reports `v-else` directives in the following cases:

- The directive has that argument. E.g. `<div v-if="foo"></div><div v-else:aaa></div>`
- The directive has that modifier. E.g. `<div v-if="foo"></div><div v-else.bbb></div>`
- The directive has that attribute value. E.g. `<div v-if="foo"></div><div v-else="bar"></div>`
- The directive is on the elements that the previous element don't have `v-if`/`v-if-else` directives. E.g. `<div v-else></div>`
- The directive is on the elements which have `v-if`/`v-if-else` directives. E.g. `<div v-if="foo" v-else></div>`

:-1: Examples of **incorrect** code for this rule:

```html
<div v-else="foo"/>
<div v-else:aaa/>
<div v-else.bbb/>
```

:+1: Examples of **correct** code for this rule:

```html
<div v-if="foo"/>
<div v-else/>
```

## :wrench: Options

Nothing.

## :couple: Related rules

- [valid-v-if]
- [valid-v-else-if]
- [no-parsing-error]


[valid-v-if]:       valid-v-if.md
[valid-v-else-if]:  valid-v-else-if.md
[no-parsing-error]:      no-parsing-error.md
