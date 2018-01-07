# enforce valid `v-else-if` directives (vue/valid-v-else-if)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every `v-else-if` directive is valid.

## :book: Rule Details

This rule reports `v-else-if` directives in the following cases:

- The directive has that argument. E.g. `<div v-if="foo"></div><div v-else-if:aaa="bar"></div>`
- The directive has that modifier. E.g. `<div v-if="foo"></div><div v-else-if.bbb="bar"></div>`
- The directive does not have that attribute value. E.g. `<div v-if="foo"></div><div v-else-if></div>`
- The directive is on the elements that the previous element don't have `v-if`/`v-else-if` directives. E.g. `<div v-else-if="bar"></div>`
- The directive is on the elements which have `v-if`/`v-else` directives. E.g. `<div v-if="foo" v-else-if="bar"></div>`

This rule does not check syntax errors in directives because it's checked by [no-parsing-error] rule.

:-1: Examples of **incorrect** code for this rule:

```html
<div v-else-if/>
<div v-else-if:aaa="foo"/>
<div v-else-if.bbb="foo"/>
```

:+1: Examples of **correct** code for this rule:

```html
<div v-if="foo"/>
<div v-else-if="bar"/>
```

## :wrench: Options

Nothing.

## :couple: Related rules

- [valid-v-if]
- [valid-v-else]
- [no-parsing-error]


[valid-v-if]:   valid-v-if.md
[valid-v-else]: valid-v-else.md
[no-parsing-error]:   no-parsing-error.md
