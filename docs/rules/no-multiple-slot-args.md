---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-multiple-slot-args
description: disallow to pass multiple arguments to scoped slots
---
# vue/no-multiple-slot-args
> disallow to pass multiple arguments to scoped slots

- :gear: This rule is included in `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule disallows to pass multiple arguments to scoped slots.  
In details, it reports call expressions if a call of `this.$scopedSlots` members has 2 or more arguments.

<eslint-code-block :rules="{'vue/no-multiple-slot-args': ['error']}">

```vue
<script>
export default {
  render(h) {
    /* ✓ GOOD */
    var children = this.$scopedSlots.default()
    var children = this.$scopedSlots.default(foo)
    var children = this.$scopedSlots.default({ foo, bar })

    /* ✗ BAD */
    var children = this.$scopedSlots.default(foo, bar)
    var children = this.$scopedSlots.default(...foo)
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [vuejs/vue#9468](https://github.com/vuejs/vue/issues/9468#issuecomment-462210146)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-multiple-slot-args.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-multiple-slot-args.js)
