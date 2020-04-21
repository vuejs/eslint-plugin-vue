---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-data-object-declaration
description: disallow using deprecated object declaration on data (in Vue.js 3.0.0+)
---
# vue/no-deprecated-data-object-declaration
> disallow using deprecated object declaration on data (in Vue.js 3.0.0+)

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports use of deprecated object declaration on `data` property (in Vue.js 3.0.0+).
The different from `vue/no-shared-component-data` is the root instance being also disallowed.

<eslint-code-block fix :rules="{'vue/no-deprecated-data-object-declaration': ['error']}">

```vue
<script>
/* ✗ BAD */
createApp({
  data: {
    foo: null
  }
}).mount('#app')
export default {
  data: {
    foo: null
  }
}

/* ✓ GOOD */
export default {
  data () {
    return {
      foo: null
    }
  }
}
createApp({
  data () {
    return {
      foo: null
    }
  }
}).mount('#app')
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further reading

- [RFC: remove data object declaration](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0019-remove-data-object-declaration.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-data-object-declaration.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-data-object-declaration.js)
