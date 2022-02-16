---
pageClass: rule-details
sidebarDepth: 0
title: vue/multi-word-component-names
description: require component names to be always multi-word
since: v7.20.0
---
# vue/multi-word-component-names

> require component names to be always multi-word

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule require component names to be always multi-word, except for root `App`
components, and built-in components provided by Vue, such as `<transition>` or
`<component>`. This prevents conflicts with existing and future HTML elements,
since all HTML elements are a single word.

<eslint-code-block filename="src/TodoItem.js" language="javascript" :rules="{'vue/multi-word-component-names': ['error']}">

```js
/* ✓ GOOD */
Vue.component('todo-item', {
  // ...
})

/* ✗ BAD */
Vue.component('Todo', {
  // ...
})
```

</eslint-code-block>

<eslint-code-block filename="src/TodoItem.js" :rules="{'vue/multi-word-component-names': ['error']}">

```vue
<script>
/* ✓ GOOD */
export default {
  name: 'TodoItem',
  // ...
}
</script>
```

</eslint-code-block>

<eslint-code-block filename="src/Todo.vue" :rules="{'vue/multi-word-component-names': ['error']}">

```vue
<script>
/* ✗ BAD */
export default {
  name: 'Todo',
  // ...
}
</script>
```

</eslint-code-block>

<eslint-code-block filename="src/Todo.vue" :rules="{'vue/multi-word-component-names': ['error']}">

```vue
<!-- filename: Todo.vue -->
<script>
/* ✗ BAD */
export default {
  // ...
}
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/multi-word-component-names": ["error", {
    "ignores": []
  }]
}
```

- `ignores` (`string[]`) ... The component names to ignore. Sets the component name to allow.

### `ignores: ["Todo"]`

<eslint-code-block :rules="{'vue/multi-word-component-names': ['error', {ignores: ['Todo']}]}">

```vue
<script>
export default {
  /* ✓ GOOD */
  name: 'Todo'
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/multi-word-component-names': ['error', {ignores: ['Todo']}]}">

```vue
<script>
export default {
  /* ✗ BAD */
  name: 'Item'
}
</script>
```

</eslint-code-block>

## :books: Further Reading

- [Style guide - Multi-word component names](https://vuejs.org/style-guide/rules-essential.html#use-multi-word-component-names)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.20.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/multi-word-component-names.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/multi-word-component-names.js)
