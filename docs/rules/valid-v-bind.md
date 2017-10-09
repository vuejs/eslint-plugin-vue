# enforce valid `v-bind` directives (valid-v-bind)

This rule checks whether every `v-bind` directive is valid.

## :book: Rule Details

This rule reports `v-bind` directives in the following cases:

- The directive does not have that attribute value. E.g. `<div v-bind:aaa></div>`
- The directive has invalid modifiers. E.g. `<div v-bind:aaa.bbb="ccc"></div>`

This rule does not report `v-bind` directives which do not have their argument (E.g. `<div v-bind="aaa"></div>`) because it's valid if the attribute value is an object.

This rule does not check syntax errors in directives because it's checked by [no-parsing-error] rule.

```html
<div v-bind/>
<div :aaa/>
<div v-bind:aaa.bbb="foo"/>
```

:+1: Examples of **correct** code for this rule:

```html
<div v-bind="foo"/>
<div v-bind:aaa="foo"/>
<div :aaa="foo"/>
<div :aaa.prop="foo"/>
```

## :wrench: Options

Nothing.

## :couple: Related rules

- [no-parsing-error]


[no-parsing-error]: no-parsing-error.md
