---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-boolean-default
description: disallow boolean defaults
since: v7.0.0
---

# vue/no-boolean-default

> disallow boolean defaults

The rule prevents Boolean props from having a default value.

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

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-boolean-default.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-boolean-default.js)
