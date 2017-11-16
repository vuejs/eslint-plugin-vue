# enforce valid `v-for` directives (valid-v-for)

This rule checks whether every `v-for` directive is valid.

## :book: Rule Details

This rule reports `v-for` directives in the following cases:

- The directive has that argument. E.g. `<div v-for:aaa></div>`
- The directive has that modifier. E.g. `<div v-for.bbb></div>`
- The directive does not have that attribute value. E.g. `<div v-for></div>`
- If the element which has the directive is a custom component, the component does not have `v-bind:key` directive. E.g. `<your-component v-for="item in list"></your-component>`
- The `v-bind:key` directive does not use the variables which are defined by the `v-for` directive. E.g. `<div v-for="x in list" :key="foo"></div>`

If the element which has the directive is a reserved element, this rule does not report even if the element does not have `v-bind:key` directive because it's not fatal error. [require-v-for-key] rule reports it.

This rule does not check syntax errors in directives. [no-parsing-error] rule reports it.
The following cases are syntax errors:

- The directive's value is not the form `alias in expr`. E.g. `<div v-for="foo"></div>`
- The alias is not LHS. E.g. `<div v-for="foo() in list"></div>`

:-1: Examples of **incorrect** code for this rule:

```html
<div v-for/>
<div v-for:aaa="todo in todos"/>
<div v-for.bbb="todo in todos"/>
<div
  v-for="todo in todos"
  is="MyComponent"
/>
<MyComponent v-for="todo in todos"/>
<MyComponent
  v-for="todo in todos"
  :key="foo"
/>
```

:+1: Examples of **correct** code for this rule:

```html
<div v-for="todo in todos"/>
<MyComponent
  v-for="todo in todos"
  :key="todo.id"
/>
<div
  v-for="todo in todos"
  :is="MyComponent"
  :key="todo.id"
/>
```

## :wrench: Options

Nothing.

## :couple: Related rules

- [require-v-for-key]
- [no-parsing-error]


[require-v-for-key]: require-v-for-key.md
[no-parsing-error]: no-parsing-error.md
