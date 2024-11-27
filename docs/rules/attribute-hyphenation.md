---
pageClass: rule-details
sidebarDepth: 0
title: vue/attribute-hyphenation
description: enforce attribute naming style on custom components in template
since: v3.9.0
---

# vue/attribute-hyphenation

> enforce attribute naming style on custom components in template

- :gear: This rule is included in all of `"plugin:vue/vue3-strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/strongly-recommended"`, `*.configs["flat/vue2-strongly-recommended"]`, `"plugin:vue/vue3-recommended"`, `*.configs["flat/recommended"]`, `"plugin:vue/recommended"` and `*.configs["flat/vue2-recommended"]`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces using hyphenated attribute names on custom components in Vue templates.

<eslint-code-block fix :rules="{'vue/attribute-hyphenation': ['error', 'always']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <MyComponent my-prop="prop" />

  <!-- ✗ BAD -->
  <MyComponent myProp="prop" />
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/attribute-hyphenation": ["error", "always" | "never", {
    "ignore": [],
    "ignoreTags": []
  }]
}
```

Default casing is set to `always`. By default the following attributes are ignored: `data-`, `aria-`, `slot-scope`,
and all the [SVG attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute) with either an upper case letter or an hyphen.

- `"always"` (default) ... Use hyphenated attribute name.
- `"never"` ... Don't use hyphenated attribute name.
- `"ignore"` ... Array of attribute names that don't need to follow the specified casing.
- `"ignoreTags"` ... Array of tag names whose attributes don't need to follow the specified casing.

### `"always"`

It errors on upper case letters.

<eslint-code-block fix :rules="{'vue/attribute-hyphenation': ['error', 'always']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <MyComponent my-prop="prop" />

  <!-- ✗ BAD -->
  <MyComponent myProp="prop" />
</template>
```

</eslint-code-block>

### `"never"`

It errors on hyphens except on the attributes in the ignored attributes list.

<eslint-code-block fix :rules="{'vue/attribute-hyphenation': ['error', 'never']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <MyComponent myProp="prop" />
  <MyComponent data-id="prop" />
  <MyComponent aria-role="button" />
  <MyComponent slot-scope="prop" />

  <!-- ✗ BAD -->
  <MyComponent my-prop="prop" />
</template>
```

</eslint-code-block>

### `"never", { "ignore": ["custom-prop"] }`

Don't use hyphenated name but allow custom attributes

<eslint-code-block fix :rules="{'vue/attribute-hyphenation': ['error', 'never', { ignore: ['custom-prop']}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <MyComponent myProp="prop" />
  <MyComponent custom-prop="prop" />
  <MyComponent data-id="prop" />
  <MyComponent aria-role="button" />
  <MyComponent slot-scope="prop" />

  <!-- ✗ BAD -->
  <MyComponent my-prop="prop" />
</template>
```

</eslint-code-block>

### `"never", { "ignoreTags": ["/^custom-/"] }`

<eslint-code-block fix :rules="{'vue/attribute-hyphenation': ['error', 'never', { ignoreTags: ['/^custom-/'] }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <custom-component my-prop="prop" />

  <!-- ✗ BAD -->
  <my-component my-prop="prop" />
</template>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/v-on-event-hyphenation](./v-on-event-hyphenation.md)
- [vue/prop-name-casing](./prop-name-casing.md)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v3.9.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/attribute-hyphenation.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/attribute-hyphenation.js)
