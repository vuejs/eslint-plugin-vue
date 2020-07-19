---
pageClass: rule-details
sidebarDepth: 0
title: vue/prop-name-casing
description: enforce specific casing for the Prop name in Vue components
---
# vue/prop-name-casing
> enforce specific casing for the Prop name in Vue components

- :gear: This rule is included in all of `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule enforce proper casing of props in vue components(camelCase).

<eslint-code-block :rules="{'vue/prop-name-casing': ['error']}">

```vue
<script>
export default {
  props: {
    /* ✓ GOOD */
    greetingText: String,

    /* ✗ BAD */
    'greeting-text': String,
    greeting_text: String
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/prop-name-casing": ["error", "camelCase" | "snake_case"]
}
```

- `"camelCase"` (default) ... Enforce property names in `props` to camel case.
- `"snake_case"` ... Enforce property names in `props` to snake case.

### `"snake_case"`

<eslint-code-block :rules="{'vue/prop-name-casing': ['error', 'snake_case']}">

```vue
<script>
export default {
  props: {
    /* ✓ GOOD */
    greeting_text: String,

    /* ✗ BAD */
    'greeting-text': String,
    greetingText: String
  }
}
</script>
```

</eslint-code-block>

## :books: Further Reading

- [Style guide - Prop name casing](https://v3.vuejs.org/style-guide/#prop-name-casing-strongly-recommended)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/prop-name-casing.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/prop-name-casing.js)
