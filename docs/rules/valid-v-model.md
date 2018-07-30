# enforce valid `v-model` directives (vue/valid-v-model)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every `v-model` directive is valid.

## :book: Rule Details

This rule reports `v-model` directives in the following cases:

- The directive has that argument. E.g. `<input v-model:aaa="foo">`
- The directive has the modifiers which are not supported. E.g. `<input v-model.bbb="foo">`
- The directive does not have that attribute value. E.g. `<input v-model>`
- The directive does not have the attribute value which is valid as LHS. E.g. `<input v-model="foo() + bar()">`
- The directive is on unsupported elements. E.g. `<div v-model="foo"></div>`
- The directive is on `<input>` elements which their types are `file`. E.g. `<input type="file" v-model="foo">`
- The directive's reference is iteration variables. E.g. `<div v-for="x in list"><input type="file" v-model="x"></div>`

This rule does not check syntax errors in directives because it's checked by [no-parsing-error] rule.

:-1: Examples of **incorrect** code for this rule:

```html
<input v-model>
<input v-model:aaa="foo">
<input v-model.bbb="foo">
<input v-model="foo + bar">
<div v-model="foo"/>
<div v-for="todo in todos">
  <input v-model="todo">
</div>
```

:+1: Examples of **correct** code for this rule:

```html
<input v-model="foo">
<input v-model.lazy="foo">
<textarea v-model="foo"/>
<MyComponent v-model="foo"/>
<div v-for="todo in todos">
  <input v-model="todo.name">
</div>
```

## :wrench: Options

Nothing.

## :couple: Related rules

- [no-parsing-error]


[no-parsing-error]: no-parsing-error.md
