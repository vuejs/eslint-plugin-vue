---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-shared-component-data
description: enforce component's data property to be a function
since: v3.8.0
---

# vue/no-shared-component-data

> enforce component's data property to be a function

- :gear: This rule is included in all of `"plugin:vue/essential"`, `*.configs["flat/essential"]`, `"plugin:vue/vue2-essential"`, `*.configs["flat/vue2-essential"]`, `"plugin:vue/strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/vue2-strongly-recommended"`, `*.configs["flat/vue2-strongly-recommended"]`, `"plugin:vue/recommended"`, `*.configs["flat/recommended"]`, `"plugin:vue/vue2-recommended"` and `*.configs["flat/vue2-recommended"]`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix-problems) can automatically fix some of the problems reported by this rule.

When using the data property on a component (i.e. anywhere except on `new Vue`), the value must be a function that returns an object.

## :book: Rule Details

When the value of `data` is an object, it’s shared across all instances of a component.

<eslint-code-block fix :rules="{'vue/no-shared-component-data': ['error']}">

```vue
<script>
/* ✓ GOOD */
Vue.component('some-comp', {
  data: function () {
    return {
      foo: 'bar'
    }
  }
})

export default {
  data() {
    return {
      foo: 'bar'
    }
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/no-shared-component-data': ['error']}">

```vue
<script>
/* ✗ BAD */
Vue.component('some-comp', {
  data: {
    foo: 'bar'
  }
})

export default {
  data: {
    foo: 'bar'
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Style guide (for v2) - Component data](https://v2.vuejs.org/v2/style-guide/#Component-data-essential)
- [API - data](https://v3.vuejs.org/api/options-data.html#data-2)
- [API (for v2) - data](https://v3.vuejs.org/api/options-data.html#data-2)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v3.8.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-shared-component-data.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-shared-component-data.js)
