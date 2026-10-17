---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-name-property
description: require a name property in Vue components
since: v6.1.0
---

# vue/require-name-property

> require a name property in Vue components

- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

This rule requires a `name` property to be set on components.

<eslint-code-block :rules="{'vue/require-name-property': ['error']}">

```vue
<script>
/* ✓ GOOD */
export default {
  name: 'OurButton'
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/require-name-property': ['error']}">

```vue
<script>
/* ✗ BAD */
export default {}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/require-name-property': ['error']}">

```vue
<script>
/* ✗ BAD */
export default {
  notName: 'OurButton'
}
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/require-name-property": ["error", {
    "checkScriptSetup": false
  }]
}
```

- `checkScriptSetup` (`boolean`) ... If `true`, also require a `name` in components using `<script setup>`, set with `defineOptions()` or in a normal `<script>` block. Default is `false`, since `<script setup>` components infer their name from the filename.

### `{ "checkScriptSetup": true }`

<eslint-code-block :rules="{'vue/require-name-property': ['error', {checkScriptSetup: true}]}">

```vue
<script setup>
/* ✗ BAD */
defineOptions({})
</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v6.1.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-name-property.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-name-property.test.ts)
