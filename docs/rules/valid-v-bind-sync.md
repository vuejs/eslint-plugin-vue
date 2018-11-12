# enforce valid `.sync` modifier on `v-bind` directives (vue/valid-v-bind-sync)

This rule checks whether every `.sync` modifier on `v-bind` directives is valid.

## :book: Rule Details

This rule reports `.sync` modifier on `v-bind` directives in the following cases:

- The directive does not have the attribute value which is valid as LHS. E.g. `<MyComponent v-bind:aaa.sync="foo() + bar()" />`
- The directive is on non Vue-components. E.g. `<input v-bind:aaa.sync="foo"></div>`
- The directive's reference is iteration variables. E.g. `<div v-for="x in list"><MyComponent v-bind:aaa.sync="x" /></div>`

This rule does not check syntax errors in directives because it's checked by [no-parsing-error] rule.

```vue
<MyComponent v-bind:aaa.sync="foo + bar" />
<MyComponent :aaa.sync="foo + bar" />

<input v-bind:aaa.sync="foo">
<input :aaa.sync="foo">

<div v-for="todo in todos">
  <MyComponent v-bind:aaa.sync="todo" />
  <MyComponent :aaa.sync="todo" />
</div>
```

:+1: Examples of **correct** code for this rule:

```vue
<MyComponent v-bind:aaa.sync="foo"/>
<MyComponent :aaa.sync="foo"/>

<div v-for="todo in todos">
  <MyComponent v-bind:aaa.sync="todo.name"/>
  <MyComponent :aaa.sync="todo.name"/>
</div>
```

## :wrench: Options

Nothing.

## :couple: Related rules

- [no-parsing-error]

[no-parsing-error]: no-parsing-error.md
