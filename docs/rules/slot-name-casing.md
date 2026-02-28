---
pageClass: rule-details
sidebarDepth: 0
title: vue/slot-name-casing
description: enforce specific casing for slot names
since: v9.32.0
---

# vue/slot-name-casing

> enforce specific casing for slot names

## :book: Rule Details

This rule enforces proper casing of slot names in Vue components.

<eslint-code-block :rules="{'vue/slot-name-casing': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <slot name="foo" />
  <slot name="fooBar" />

  <!-- ✗ BAD -->
  <slot name="foo-bar" />
  <slot name="foo_bar" />
  <slot name="foo:bar" />
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/slot-name-casing": ["error", "camelCase" | "kebab-case" | "singleword"]
}
```

- `"camelCase"` (default) ... Enforce slot name to be in camel case.
- `"kebab-case"` ... Enforce slot name to be in kebab case.
- `"singleword"` ... Enforce slot name to be a single word.

### `"kebab-case"`

<eslint-code-block :rules="{'vue/prop-name-casing': ['error', 'kebab-case']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <slot name="foo" />
  <slot name="foo-bar" />

  <!-- ✗ BAD -->
  <slot name="fooBar" />
  <slot name="foo_bar" />
  <slot name="foo:bar" />
</template>
```

</eslint-code-block>

### `"singleword"`

<eslint-code-block :rules="{'vue/prop-name-casing': ['error', 'singleword']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <slot name="foo" />

  <!-- ✗ BAD -->
  <slot name="foo-bar" />
  <slot name="fooBar" />
  <slot name="foo_bar" />
  <slot name="foo:bar" />
</template>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.32.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/slot-name-casing.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/slot-name-casing.js)
