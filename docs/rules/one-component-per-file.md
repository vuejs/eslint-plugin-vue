# enforce that each component should be in its own file

## :book: Rule Details

This rule checks if there is oly one component per file.

:-1: Examples of **incorrect** code for this rule:

```js
Vue.component('TodoList', {
  // ...
})

Vue.component('TodoItem', {
  // ...
})
```

:+1: Examples of **correct** code for this rule:

```js
export default {
  name: 'my-component'
}
```

## :wrench: Options

Nothing.

## :books: Further reading

- [Style guide - Component files](https://vuejs.org/v2/style-guide/#Component-files-strongly-recommended)
