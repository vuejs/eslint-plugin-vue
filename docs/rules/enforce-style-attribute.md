---
pageClass: rule-details
sidebarDepth: 0
title: vue/enforce-style-attribute
description: enforce or forbid the use of the `scoped` and `module` attributes in SFC top level style tags
---
# vue/enforce-style-attribute

> enforce or forbid the use of the `scoped` and `module` attributes in SFC top level style tags

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule allows you to selectively allow attributes on your top level style tags and warns when using an attribute that is not allowed.

### `"scoped"`

<eslint-code-block :rules="{'vue/enforce-style-attribute': ['error', { allows: ['scoped'] }]}">

```vue
<!-- ✓ GOOD -->
<style scoped></style>
<style lang="scss" src="../path/to/style.scss" scoped></style>

<!-- ✗ BAD -->
<style module></style>

<!-- ✗ BAD -->
<style></style>
```

</eslint-code-block>

### `"module"`

<eslint-code-block :rules="{'vue/enforce-style-attribute': ['error', { allows: ['module'] }]}">

```vue
<!-- ✓ GOOD -->
<style module></style>

<!-- ✗ BAD -->
<style scoped></style>

<!-- ✗ BAD -->
<style></style>
```

</eslint-code-block>

### `"no-attributes"`

<eslint-code-block :rules="{'vue/enforce-style-attribute': ['error', { allows: ['no-attributes']}]}">

```vue
<!-- ✓ GOOD -->
<style></style>

<!-- ✗ BAD -->
<style scoped></style>

<!-- ✗ BAD -->
<style module></style>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/enforce-style-attribute": [
    "error",
    { "allows": ["scoped", "module", "no-attributes"] }
  ]
}
```

- `"allows"` (`["scoped" | "module" | "no-attributes"]`) Array of attributes to allow on a top level style tag. Default: `["scoped"]`

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/enforce-style-attribute.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/enforce-style-attribute.js)
