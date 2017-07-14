# Keep proper order of properties in your `components` (order-in-components)

This rule makes sure you keep declared order of properties in components.

## :book: Rule Details

Recommended order of properties is as follows:

1. Options / Misc (`name`, `delimiters`, `functional`, `model`)
2. Options / Assets (`components`, `directives`, `filters`)
3. Options / Composition (`parent`, `mixins`, `extends`, `provide`, `inject`)
4. `el`
5. `template`
6. `props`
7. `propsData`
8. `data`
9. `computed`
10. `watch`
11. `lifecycleHooks`
12. `methods`
13. `render`
14. `renderError`

Note that `lifecycleHooks` is not a regular property - it indicates the group of all lifecycle hooks just to simplify the configuration.

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
    ['name', 'delimiters', 'functional', 'model'],
    ['components', 'directives', 'filters'],
    ['parent', 'mixins', 'extends', 'provide', 'inject'],
    'el',
    'template',
    'props',
    'propsData',
    'data',
    'computed',
    'watch',
    'LIFECYCLE_HOOKS',
    'methods',
    'render',
    'renderError'
  ]
}]
```

If you want some of properties to be treated equally in order you can group them into arrays, like we did with `name`, `delimiters`, `funcitonal` and `model`.
