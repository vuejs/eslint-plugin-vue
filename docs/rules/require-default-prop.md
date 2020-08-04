---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-default-prop
description: require default value for props
---
# vue/require-default-prop
> require default value for props

- :gear: This rule is included in all of `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule requires default value to be set for each props that are not marked as `required` (except `Boolean` props).

<eslint-code-block :rules="{'vue/require-default-prop': ['error']}">

```vue
<script>
export default {
  props: {
    /* ✓ GOOD */
    a: {
      type: Number,
      required: true
    },
    b: {
      type: Number,
      default: 0
    },
    c: {
      type: Number,
      default: 0,
      required: false
    },
    d: {
      type: Boolean, // Boolean is the only type that doesn't require default
    },

    /* ✗ BAD */
    e: Number,
    f: [Number, String],
    g: [Boolean, Number],
    j: {
      type: Number
    },
    i: {
      type: Number,
      required: false
    }
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Style guide - Prop definitions](https://v3.vuejs.org/style-guide/#prop-definitions-essential)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-default-prop.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-default-prop.js)
