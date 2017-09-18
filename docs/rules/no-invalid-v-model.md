# disallow invalid `v-model` directives (no-invalid-v-model)

- :warning: This rule was **deprecated** and replaced by [valid-v-model](valid-v-model.md) rule.

This rule checks whether every `v-model` directive is valid.

## :book: Rule Details

This rule reports `v-model` directives in the following cases:

- The directive has that argument. E.g. `<input v-model:aaa="foo">`
- The directive has the modifiers which are not supported. E.g. `<input v-model.bbb="foo">`
- The directive does not have that attribute value. E.g. `<input v-model>`
- The directive does not have the attribute value which is valid as LHS. E.g. `<input v-model="foo() + bar()">`
- The directive is on unsupported elements. E.g. `<div v-model="foo"></div>`
- The directive is on `<input>` elements which their types are dynamic. E.g. `<input :type="type" v-model="foo">`
- The directive is on `<input>` elements which their types are `file`. E.g. `<input type="file" v-model="foo">`
- The directive's reference is iteration variables. E.g. `<div v-for="x in list"><input type="file" v-model="x"></div>`

This rule does not check syntax errors in directives because it's checked by [no-parsing-error] rule.

:-1: Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <input v-model>
        <input v-model:aaa="foo">
        <input v-model.bbb="foo">
        <input v-model="foo + bar">
        <div v-model="foo"></div>
        <div v-for="x in list">
            <input v-model="x">
        </div>
    </div>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
    <div>
        <input v-model="foo">
        <input v-model.lazy="foo">
        <textarea v-model="foo"></textarea>
        <your-component v-model="foo"></your-component>
        <div v-for="x in list">
            <input v-model="x.name">
        </div>
    </div>
</template>
```

## :wrench: Options

Nothing.

## :couple: Related rules

- [no-parsing-error]


[no-parsing-error]: no-parsing-error.md
