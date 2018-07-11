# disallow use v-if on the same element as v-for. (vue/no-use-v-if-with-v-for)

> Never use `v-if` on the same element as `v-for`.
>
> There are two common cases where this can be tempting:
>
> * To filter items in a list (e.g. `v-for="user in users" v-if="user.isActive"`). In these cases, replace `users` with a new computed property that returns your filtered list (e.g. `activeUsers`).
>
> * To avoid rendering a list if it should be hidden (e.g. `v-for="user in users" v-if="shouldShowUsers"`). In these cases, move the `v-if` to a container element (e.g. `ul`, `ol`).
>
> https://vuejs.org/v2/style-guide/#Avoid-v-if-with-v-for-essential


## :book: Rule Details

:-1: Examples of **incorrect** code for this rule:

```html
<TodoItem
  v-if="complete"
  v-for="todo in todos"
  :todo="todo"
/>
```

In this case, the `v-if` should be written on the wrapper element.


```html
<TodoItem
  v-for="todo in todos"
  v-if="todo.shown"
  :todo="todo"
/>
```

In this case, the `v-for` list variable should be replace with a computed property that returns your filtered list.


:+1: Examples of **correct** code for this rule:


```html
<ul v-if="complete">
  <TodoItem
    v-for="todo in todos"
    :todo="todo"
  />
</ul>
```



```html
<TodoItem
  v-for="todo in shownTodos"
  :todo="todo"
/>
```

```js
computed: {
  shownTodos() {
    return this.todos.filter((todo) => todo.shown)
  }
}
```

## :wrench: Options

`allowUsingIterationVar` - Enables The `v-if` directive use the reference which is to the variables which are defined by the `v-for` directives.

```js
'vue/no-use-v-if-with-v-for': ['error', {
  allowUsingIterationVar: true // default: false
}]
```

:+1: Examples of additional **correct** code for this rule with sample `"allowUsingIterationVar": true` options:

```html
<TodoItem
  v-for="todo in todos"
  v-if="todo.shown"
  :todo="todo"
/>
```

:-1: Examples of additional **incorrect** code for this rule with sample `"allowUsingIterationVar": true` options:

```html
<TodoItem
  v-if="complete"
  v-for="todo in todos"
  :todo="todo"
/>
```

