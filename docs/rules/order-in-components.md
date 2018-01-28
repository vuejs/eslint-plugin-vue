# enforce order of properties in components (vue/order-in-components)

- :gear: This rule is included in `"plugin:vue/recommended"`.

This rule makes sure you keep declared order of properties in components.

## :book: Rule Details

Recommended order of properties can be [found here](https://vuejs.org/v2/style-guide/#Component-instance-options-order-recommended).

Examples of **incorrect** code for this rule:

```js
name: 'app',
data () {
  return {
    msg: 'Welcome to Your Vue.js App'
  }
},
props: {
  propA: Number,
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

``` json
"vue/order-in-components": ["error", {
  "order": [
    "el",
    "name",
    "parent",
    "functional",
    ["delimiters", "comments"],
    ["components", "directives", "filters"],
    "extends",
    "mixins",
    "inheritAttrs",
    "model",
    ["props", "propsData"],
    "data",
    "computed",
    "watch",
    "LIFECYCLE_HOOKS",
    "methods",
    ["template", "render"],
    "renderError"
  ]
}]
```

If you want some of properties to be treated equally in order you can group them into arrays, like we did with `delimiters` and `comments`.
