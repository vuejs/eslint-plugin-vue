---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-restricted-props
description: disallow specific props
since: v7.3.0
---
# vue/no-restricted-props

> disallow specific props

- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

This rule allows you to specify props that you don't want to use in your application.

## :wrench: Options

This rule takes a list of strings, where each string is a prop name or pattern to be restricted:

```json
{
  "vue/no-restricted-props": ["error", "value", "/^forbidden/"]
}
```

<eslint-code-block :rules="{'vue/no-restricted-props': ['error', 'value', '/^forbidden/']}">

```vue
<script>
export default {
  props: {
    /* ✗ BAD */
    value: String,
    forbiddenNum: Number,

    /* ✓ GOOD */
    foo: {},
    bar: {},
    arrowedBool: Boolean,
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-restricted-props': ['error', 'value', '/^forbidden/']}">

```vue
<script>
export default {
  props: [
    /* ✗ BAD */
    'value',
    'forbiddenNum',

    /* ✓ GOOD */
    'foo',
    'bar',
    'arrowedBool',
  ]
}
</script>
```

</eslint-code-block>

Alternatively, the rule also accepts objects.

```json
{
  "vue/no-restricted-props": ["error",
    {
      "name": "value",
      "message": "If you intend a prop for v-model, it should be 'modelValue' in Vue 3.",
      "suggest": "modelValue"
    },
  ]
}
```

The following properties can be specified for the object.

- `name` ... Specify the prop name or pattern.
- `message` ... Specify an optional custom message.
- `suggest` ... Specify an optional name to suggest changes.

<eslint-code-block :rules="{'vue/no-restricted-props': ['error', { name: 'value', message: 'If you intend a prop for v-model, it should be \'modelValue\' in Vue 3.', suggest: 'modelValue'}]}">

```vue
<script>
export default {
  props: [
    /* ✗ BAD */
    'value',
  ]
}
</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.3.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-restricted-props.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-restricted-props.js)
