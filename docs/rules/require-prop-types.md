---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-prop-types
description: require type definitions in props
---
# vue/require-prop-types
> require type definitions in props

- :gear: This rule is included in all of `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule enforces that a `props` statement contains type definition.

In committed code, prop definitions should always be as detailed as possible, specifying at least type(s).

<eslint-code-block :rules="{'vue/require-prop-types': ['error']}">

```vue
<script>
/* ✓ GOOD */
Vue.component('foo', {
  props: {
    // Without options, just type reference
    foo: String,
    // With options with type field
    bar: {
      type: String,
      required: true,
    },
    // With options without type field but with validator field
    baz: {
      required: true,
      validator: function (value) {
        return (
          value === null ||
          Array.isArray(value) && value.length > 0
        )
      }
    }
  }
})

/* ✗ BAD */
Vue.component('bar', {
  props: ['foo']
})

Vue.component('baz', {
  props: {
    foo: {},
  }
})
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Style guide - Prop definitions](https://v3.vuejs.org/style-guide/#prop-definitions-essential)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-prop-types.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-prop-types.js)
