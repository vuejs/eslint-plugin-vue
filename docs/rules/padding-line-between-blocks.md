---
pageClass: rule-details
sidebarDepth: 0
title: vue/padding-line-between-blocks
description: require or disallow padding lines between blocks
---
# vue/padding-line-between-blocks
> require or disallow padding lines between blocks

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule requires or disallows blank lines between the given 2 blocks. Properly blank lines help developers to understand the code.

<eslint-code-block fix :rules="{'vue/padding-line-between-blocks': ['error']}">

```vue
<!-- ✓ GOOD -->
<template>
  <div></div>
</template>

<script>
export default {}
</script>

<style></style>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/padding-line-between-blocks': ['error']}">

```vue
<!-- ✗ BAD -->
<template>
  <div></div>
</template>
<script>
export default {}
</script>
<style></style>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/padding-line-between-blocks": ["error", "always" | "never"]
}
```

- `"always"` (default) ... Requires one or more blank lines. Note it does not count lines that comments exist as blank lines.
- `"never"` ... Disallows blank lines.

### `"always"` (default)

<eslint-code-block fix :rules="{'vue/padding-line-between-blocks': ['error']}">

```vue
<!-- ✓ GOOD -->
<template>
  <div></div>
</template>

<script>
export default {}
</script>

<style></style>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/padding-line-between-blocks': ['error']}">

```vue
<!-- ✗ BAD -->
<template>
  <div></div>
</template>
<script>
export default {}
</script>
<style></style>
```

</eslint-code-block>

### `"never"`

<eslint-code-block fix :rules="{'vue/padding-line-between-blocks': ['error', 'never']}">

```vue
<!-- ✓ GOOD -->
<template>
  <div></div>
</template>
<script>
export default {}
</script>
<style></style>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/padding-line-between-blocks': ['error', 'never']}">

```vue
<!-- ✗ BAD -->
<template>
  <div></div>
</template>

<script>
export default {}
</script>

<style></style>
```

</eslint-code-block>

## :books: Further Reading

- [padding-line-between-statements]
- [lines-between-class-members]

[padding-line-between-statements]: https://eslint.org/docs/rules/padding-line-between-statements
[lines-between-class-members]: https://eslint.org/docs/rules/lines-between-class-members


## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/padding-line-between-blocks.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/padding-line-between-blocks.js)
