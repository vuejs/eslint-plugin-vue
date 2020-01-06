---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-name-property
description: require a name property in Vue components
---
# vue/require-name-property
> require a name property in Vue components

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
export default {
}
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

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-name-property.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-name-property.js)
