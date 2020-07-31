---
pageClass: rule-details
sidebarDepth: 0
title: vue/order-in-components
description: enforce order of properties in components
---
# vue/order-in-components
> enforce order of properties in components

- :gear: This rule is included in `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule makes sure you keep declared order of properties in components.
Recommended order of properties can be [found here](https://v3.vuejs.org/style-guide/#component-instance-options-order-recommended).

<eslint-code-block fix :rules="{'vue/order-in-components': ['error']}">

```vue
<script>
/* ✓ GOOD */
export default {
  name: 'app',
  props: {
    propA: Number
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/order-in-components': ['error']}">

```vue
<script>
/* ✗ BAD */
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  props: {
    propA: Number
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/order-in-components": ["error", {
    "order": [
      "el",
      "name",
      "key",
      "parent",
      "functional",
      ["delimiters", "comments"],
      ["components", "directives", "filters"],
      "extends",
      "mixins",
      ["provide", "inject"],
      "ROUTER_GUARDS",
      "layout",
      "middleware",
      "validate",
      "scrollToTop",
      "transition",
      "loading",
      "inheritAttrs",
      "model",
      ["props", "propsData"],
      "emits",
      "setup",
      "asyncData",
      "data",
      "fetch",
      "head",
      "computed",
      "watch",
      "watchQuery",
      "LIFECYCLE_HOOKS",
      "methods",
      ["template", "render"],
      "renderError"
    ]
  }]
}
```

- `order` (`(string | string[])[]`) ... The order of properties. Elements are the property names or one of the following groups:

  - `LIFECYCLE_HOOKS`: [Vue Lifecycle Events](https://v3.vuejs.org/guide/instance.html#lifecycle-diagram), in the order they are called
  - `ROUTER_GUARDS`: [Vue Router Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards), in the order they are called

  If an element is an array of strings, it means any of those can be placed there unordered. Default is above.


## :books: Further Reading

- [Style guide - Component/instance options order](https://v3.vuejs.org/style-guide/#component-instance-options-order-recommended)
- [Style guide (for v2) - Component/instance options order](https://vuejs.org/v2/style-guide/#Component-instance-options-order-recommended)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/order-in-components.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/order-in-components.js)
