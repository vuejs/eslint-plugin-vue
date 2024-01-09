---
pageClass: rule-details
sidebarDepth: 0
title: vue/enforce-style-attribute
description: enforce or forbid the use of the `scoped` and `module` attributes in SFC top level style tags
---

# vue/enforce-style-attribute

> enforce or forbid the use of the `scoped` and `module` attributes in SFC top level style tags

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> **_This rule has not been released yet._** </badge>

## :book: Rule Details

This rule allows you to explicitly allow the use of the `scoped` and `module` attributes on your top level style tags.

### `"scoped"`

<eslint-code-block :rules="{'vue/enforce-style-attribute': ['error', { allow: ['scoped'] }]}">

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

<eslint-code-block :rules="{'vue/enforce-style-attribute': ['error', { allow: ['module'] }]}">

```vue
<!-- ✓ GOOD -->
<style module></style>

<!-- ✗ BAD -->
<style scoped></style>

<!-- ✗ BAD -->
<style></style>
```

</eslint-code-block>

### `"plain"`

<eslint-code-block :rules="{'vue/enforce-style-attribute': ['error', { allow: ['plain']}]}">

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
    { "allow": ["scoped", "module", "plain"] }
  ]
}
```

- `"allow"` (`["scoped" | "module" | "plain"]`) Array of attributes to allow on a top level style tag. The option `plain` is used to allow style tags that have neither the `scoped` nor `module` attributes. Default: `["scoped"]`

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/enforce-style-attribute.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/enforce-style-attribute.js)
