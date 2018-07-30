# disallow confusing `v-for` and `v-if` on the same element (vue/no-confusing-v-for-v-if)

- :gear: This rule is included in `"plugin:vue/recommended"`.
- :warning: This rule was **deprecated** and replaced by [vue/no-use-v-if-with-v-for](no-use-v-if-with-v-for.md) rule.

> When they exist on the same node, `v-for` has a higher priority than `v-if`. That means the `v-if` will be run on each iteration of the loop separately.
>
> https://vuejs.org/v2/guide/list.html#v-for-with-v-if

So when they exist on the same node, `v-if` directive should use the reference which is to the variables which are defined by the `v-for` directives.

## :book: Rule Details

This rule reports the elements which have both `v-for` and `v-if` directives in the following cases:

- The `v-if` directive does not use the reference which is to the variables which are defined by the `v-for` directives.

In that case, the `v-if` should be written on the wrapper element.

:-1: Examples of **incorrect** code for this rule:

```html
<TodoItem
  v-if="complete"
  v-for="todo in todos"
  :todo="todo"
/>
```

:+1: Examples of **correct** code for this rule:

```html
<TodoItem
  v-for="todo in todos"
  v-if="todo.shown"
  :todo="todo"
/>
```

```html
<ul v-if="shown">
  <TodoItem
    v-for="todo in todos"
    :todo="todo"
  />
</ul>
```

## :wrench: Options

Nothing.

## Related links

- [Style guide - Avoid v-if with v-for](https://vuejs.org/v2/style-guide/#Avoid-v-if-with-v-for-essential)
- [Guide - Conditional / v-if with v-for](https://vuejs.org/v2/guide/conditional.html#v-if-with-v-for)
- [Guide - List / v-for with v-if](https://vuejs.org/v2/guide/list.html#v-for-with-v-if)
