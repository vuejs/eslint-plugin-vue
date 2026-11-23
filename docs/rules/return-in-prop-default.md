---
pageClass: rule-details
sidebarDepth: 0
title: vue/return-in-prop-default
description: enforce that a return statement is present in prop default factories
---

# vue/return-in-prop-default

> enforce that a return statement is present in prop default factories

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule reports prop default factories that can finish without a `return` statement. It checks synchronous inline factories in component options and runtime `defineProps` declarations, including nonempty bodies and branches that can fall through.

The rule checks props whose `type` is `String`, `Number`, `Boolean`, `Object`, `Array`, `Symbol`, `BigInt`, or an array of these types. It skips props with missing or unresolved types and types that include `Function`, since their defaults may be function values. Prop options with spreads or unresolved property names are also skipped. It does not check type-only `withDefaults`, destructured defaults, or `defineModel`.

Expression-bodied arrows, explicit `return undefined`, `return null`, and bare `return` statements are allowed. Paths that throw do not need a return. Async and generator functions are skipped because calling them returns a promise or iterator even without a return statement. This rule checks for missing returns, not the type of the returned value; use [vue/require-valid-default-prop](./require-valid-default-prop.md) to check default value types.

<eslint-code-block :rules="{'vue/return-in-prop-default': ['error']}">

```vue
<script>
export default {
  props: {
    /* ✓ GOOD */
    settings: { type: Object, default: () => ({}) },
    items: { type: Array, default() { return [] } },
    optional: { type: Object, default: () => undefined },
    callback: { type: Function, default() {} },

    /* ✗ BAD */
    empty: { type: Object, default: () => {} },
    missing: { type: Object, default() { const result = {} } },
    conditional: {
      type: Array,
      default(props) {
        if (props.enabled) return []
      }
    }
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/return-in-prop-default': ['error']}">

```vue
<script setup>
defineProps({
  /* ✓ GOOD */
  settings: { type: Object, default: () => ({}) },

  /* ✗ BAD */
  items: { type: Array, default() {} }
})
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/return-in-prop-default.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/return-in-prop-default.test.ts)
