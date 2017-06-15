# Keep proper order of properties in your components (order-in-components)

This rule makes sure you keep declared order of properties in components.

## :book: Rule Details

Recommended order of properties is as follows:

1. Options / Misc (`name`, `delimiters`, `functional`, `model`)
2. `el`
3. Options / Assets (`components`, `directives`, `filters`)
4. Options / Composition (`parent`, `mixins`, `extends`, `provide`, `inject`)
5. Options / Data
  1. `props`
  2. `propsData`
  3. `data`
  4. `computed`
  5. `methods`
  6. `watch`
6. lifecycle hooks
7. `template`
8. `render`
9. `renderError`

Examples of **incorrect** code for this rule:

```js

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  props: {
    propA: Number,
  },
}

```

Examples of **correct** code for this rule:

```js

export default {
  name: 'app',
  props: {
    propA: Number,
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
}

```

### Options

If you want you can change the order providing the optional configuration in your `.eslintrc` file. Setting responsible for the above order looks like this:

```
vue/order-in-components: [2, {
  order: [
    'name',
    ['mixins', 'components', 'directives', 'filters'],
    'props',
    'template',
    'data',
    'computed',
    'methods',
    'lifecycle_hooks',
    'render',
  ]
}]
```

If you want some of properties to be treated equally in order you can group them into arrays, like we did with `mixins`, `components`, `directives` and `filters`.
