---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-restricted-class
description: disallow specific classes
since: v7.19.0
---
# vue/no-restricted-classes

> disallow specific classes

## :book: Rule Details

This rule lets you specify a list of classes that you don't want to allow in your templates.

## :wrench: Options

The simplest way to specify a list of forbidden classes is to pass it directly
in the rule configuration.

```json
{
  "vue/no-restricted-props": ["error", { classes: ["forbidden"] }]
}
```

<eslint-code-block :rules="{'vue/no-restricted-class': ['error', { classes: ['forbidden'] }]}">

```vue
<template>
  <!-- ✗ BAD -->
  <div class="forbidden" />
  <div :class="{forbidden: someBoolean}" />
  <div :class="`forbidden ${someString}`" />
  <div :class="'forbidden'" />
  <div :class="'forbidden ' + someString" />
  <!-- ✗ GOOD -->
  <div class="allowed-class" />
</template>

<script>
export default {
  props: {
    someBoolean: Boolean,
    someString: String,
  }
}
</script>
```

</eslint-code-block>


Alternatively, you can also specify a list of files that contain forbidden classes. Each file
must contain a JSON-formatted array of strings.

```json
{
  "vue/no-restricted-props": ["error",
    {
      files: [".eslint/forbidden-classes.json"]
    },
  ]
}
```

`.eslint/forbidden-classes.json`:

```
[
  "forbidden-class",
  "another-forbidden-class"
]
```

::: warning Note
This rule will only detect classes that are used as strings in your templates. Passing classes via
variables, like below, will not be detected by this rule.

```vue
<template>
  <div :class="classes" />
</template>

<script>
export default {
  data() {
    return {
      classes: "forbidden"
    }
  }
}
</script>
```
:::

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.19.0.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-restricted-class.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-restricted-class.js)
