---
pageClass: rule-details
sidebarDepth: 0
title: vue/return-in-emits-validator
description: enforce that a return statement is present in emits validator
---
# vue/return-in-emits-validator
> enforce that a return statement is present in emits validator

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.

## :book: Rule Details

This rule enforces that a `return` statement is present in `emits` validators.

<eslint-code-block :rules="{'vue/return-in-emits-validator': ['error']}">

```vue
<script>
export default {
  emits: {
    /* ✓ GOOD */
    foo (evt) {
      if (evt) {
        return true
      } else {
        return false
      }
    },
    bar: function () {
      return true
    },
    baz (evt) {
      if (evt) {
        return true
      }
    },
    /* ✗ BAD */
    qux: function () {},
    quux (evt) {
      if (!evt) {
        return false
      }
    }
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Guide - Custom Events / Validate Emitted Events](https://v3.vuejs.org/guide/component-custom-events.html#validate-emitted-events)
- [Vue RFCs - 0030-emits-option](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0030-emits-option.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/return-in-emits-validator.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/return-in-emits-validator.js)
