---
pageClass: rule-details
sidebarDepth: 0
title: vue/enforce-style-attribute
description: enforce either the `scoped` or `module`  attribute in SFC top level style tags
---

# vue/enforce-style-attribute

> enfore either the `scoped` or `module` attribute in SFC top level style tags

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :wrench: Options

```json
{
  "vue/attribute-hyphenation": ["error", "either" | "scoped" |  "module"]
}
```

## :book: Rule Details

This rule warns you about top level style tags that are missing either the `scoped` or `module` attribute.

- `"either"` (default) ... Warn if a style tag doesn't have neither `scoped` nor `module` attributes.
- `"scoped"` ... Warn if a style tag doesn't have the `scoped` attribute.
- `"module"` ... Warn if a style tag doesn't have the `module` attribute.

### `"either"`

<eslint-code-block :rules="{'vue/enforce-style-attribute': ['error', 'either']}">

```vue
<!-- ✓ GOOD -->
<style scoped></style>
<style lang="scss" src="../path/to/style.scss" scoped></style>

<!-- ✓ GOOD -->
<style module></style>

<!-- ✗ BAD -->
<style></style>
```

</eslint-code-block>

### `"scoped"`

<eslint-code-block :rules="{'vue/enforce-style-attribute': ['error', 'scoped']}">

```vue
<!-- ✓ GOOD -->
<style scoped></style>
<style lang="scss" src="../path/to/style.scss" scoped></style>

<!-- ✗ BAD -->
<style></style>
<style module></style>
```

</eslint-code-block>

### `"module"`

<eslint-code-block :rules="{'vue/enforce-style-attribute': ['error', 'module']}">

```vue
<!-- ✓ GOOD -->
<style module></style>

<!-- ✗ BAD -->
<style></style>
<style scoped></style>
<style lang="scss" src="../path/to/style.scss" scoped></style>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/enforce-style-attribute.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/enforce-style-attribute.js)
