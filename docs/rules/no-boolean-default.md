---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-boolean-default
description: disallow boolean defaults
since: v7.0.0
---

# vue/no-boolean-default

> disallow boolean defaults

The rule prevents Boolean props from having a default value, except `undefined`.

## :book: Rule Details

The rule is to enforce the HTML standard of always defaulting boolean attributes to false.

<eslint-code-block :rules="{'vue/no-boolean-default': ['error']}">

```vue
<script>
export default {
  props: {
    foo: {
      type: Boolean,
      default: true
    },
    bar: {
      type: Boolean
    }
  }
}
</script>
```

</eslint-code-block>

The rule always allows `default: undefined` for both `"no-default"` and `"default-false"`.

If the parent does not pass a Boolean prop, Vue casts the prop to `false`. Vue does not cast the prop when the prop has a `default` key. With `default: undefined`, the prop stays `undefined`. As a result, the component can tell "not passed" from "passed `false`". For example, the component is controlled when the parent passes the prop, and uncontrolled when the parent does not.

<eslint-code-block :rules="{'vue/no-boolean-default': ['error', 'default-false']}">

```vue
<script>
export default {
  props: {
    /* ✓ GOOD */
    open: {
      type: Boolean,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    /* ✗ BAD */
    visible: {
      type: Boolean,
      default: true
    }
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

- `'no-default'` (default) allows a prop definition object, but enforces that the `default` property not be defined.
- `'default-false'` enforces that the default can be set but must be set to `false`.

```json
  "vue/no-boolean-default": ["error", "no-default|default-false"]
```

## :couple: Related Rules

- [vue/prefer-true-attribute-shorthand](./prefer-true-attribute-shorthand.md)
- [vue/require-default-prop](./require-default-prop.md)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-boolean-default.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-boolean-default.test.ts)
