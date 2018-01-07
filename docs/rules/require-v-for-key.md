# require `v-bind:key` with `v-for` directives (vue/require-v-for-key)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

When `v-for` is written on custom components, it requires `v-bind:key` at the same time.
On other elements, it's better that `v-bind:key` is written as well.

## :book: Rule Details

This rule reports the elements which have `v-for` and do not have `v-bind:key`.

This rule does not report custom components.
It will be reported by [no-invalid-v-for] rule.

:-1: Examples of **incorrect** code for this rule:

```html
<div v-for="todo in todos"/>
```

:+1: Examples of **correct** code for this rule:

```html
<div
  v-for="todo in todos"
  :key="todo.id"
/>
```

## :wrench: Options

Nothing.

## :couple: Related rules

- [no-invalid-v-for]

[no-invalid-v-for]: ./no-invalid-v-for.md
