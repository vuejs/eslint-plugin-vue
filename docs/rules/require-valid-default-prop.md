---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-valid-default-prop
description: enforce props default values to be valid
---
# vue/require-valid-default-prop
> enforce props default values to be valid

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule checks whether the default value of each prop is valid for the given type. It should report an error when default value for type `Array` or `Object` is not returned using function.

<eslint-code-block :rules="{'vue/require-valid-default-prop': ['error']}">

```vue
<script>
export default {
  props: {
    /* ✓ GOOD */
    // basic type check (`null` means accept any type)
    propA: Number,
    // multiple possible types
    propB: [String, Number],
    // a number with default value
    propD: {
      type: Number,
      default: 100
    },
    // object/array defaults should be returned from a factory function
    propE: {
      type: Object,
      default() {
        return { message: 'hello' }
      }
    },
    propF: {
      type: Array,
      default() {
        return []
      }
    },
    /* ✗ BAD */
    propA: {
      type: String,
      default: {}
    },
    propB: {
      type: String,
      default: []
    },
    propC: {
      type: Object,
      default: []
    },
    propD: {
      type: Array,
      default: []
    },
    propE: {
      type: Object,
      default: { message: 'hello' }
    }
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further reading

- [Guide - Prop Validation](https://vuejs.org/v2/guide/components-props.html#Prop-Validation)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-valid-default-prop.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-valid-default-prop.js)
