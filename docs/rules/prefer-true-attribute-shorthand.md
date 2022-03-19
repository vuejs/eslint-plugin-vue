---
pageClass: rule-details
sidebarDepth: 0
title: vue/prefer-true-attribute-shorthand
description: require shorthand form attribute when `v-bind` value is `true`
since: v8.5.0
---
# vue/prefer-true-attribute-shorthand

> require shorthand form attribute when `v-bind` value is `true`

- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

`v-bind` attribute with `true` value usually can be written in shorthand form. This can reduce verbosity.

<eslint-code-block :rules="{'vue/prefer-true-attribute-shorthand': ['error']}">

```vue
<template>
  <!-- ✗ BAD -->
  <MyComponent v-bind:show="true" />
  <MyComponent :show="true" />

  <!-- ✓ GOOD -->
  <MyComponent show />
  <MyComponent another-prop="true" />
</template>
```

</eslint-code-block>

::: warning Warning
The shorthand form is not always equivalent! If a prop accepts multiple types, but Boolean is not the first one, a shorthand prop won't pass `true`.
:::

```vue
<script>
export default {
  name: 'MyComponent',
  props: {
    bool: Boolean,
    boolOrString: [Boolean, String],
    stringOrBool: [String, Boolean],
  }
}
</script>
```

**Shorthand form:**

```vue
<MyComponent bool bool-or-string string-or-bool />
```

```plain
bool: true (boolean)
boolOrString: true (boolean)
stringOrBool: "" (string)
```

**Longhand form:**

```vue
<MyComponent :bool="true" :bool-or-string="true" :string-or-bool="true" />
```

```plain
bool: true (boolean)
boolOrString: true (boolean)
stringOrBool: true (boolean)
```

Those two calls will introduce different render result. See [this demo](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBNeUNvbXBvbmVudCBmcm9tICcuL015Q29tcG9uZW50LnZ1ZSdcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIFNob3J0aGFuZCBmb3JtOlxuICA8TXlDb21wb25lbnQgYm9vbCBib29sLW9yLXN0cmluZyBzdHJpbmctb3ItYm9vbCAvPlxuICBcbiAgTG9uZ2hhbmQgZm9ybTpcbiAgPE15Q29tcG9uZW50IDpib29sPVwidHJ1ZVwiIDpib29sLW9yLXN0cmluZz1cInRydWVcIiA6c3RyaW5nLW9yLWJvb2w9XCJ0cnVlXCIgLz5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIk15Q29tcG9uZW50LnZ1ZSI6IjxzY3JpcHQ+XG5leHBvcnQgZGVmYXVsdCB7XG4gIHByb3BzOiB7XG4gICAgYm9vbDogQm9vbGVhbixcbiAgICBib29sT3JTdHJpbmc6IFtCb29sZWFuLCBTdHJpbmddLFxuICAgIHN0cmluZ09yQm9vbDogW1N0cmluZywgQm9vbGVhbl0sXG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxwcmU+XG5ib29sOiB7e2Jvb2x9fSAoe3sgdHlwZW9mIGJvb2wgfX0pXG5ib29sT3JTdHJpbmc6IHt7Ym9vbE9yU3RyaW5nfX0gKHt7IHR5cGVvZiBib29sT3JTdHJpbmcgfX0pXG5zdHJpbmdPckJvb2w6IHt7c3RyaW5nT3JCb29sfX0gKHt7IHR5cGVvZiBzdHJpbmdPckJvb2wgfX0pXG4gIDwvcHJlPlxuPC90ZW1wbGF0ZT4ifQ==).

## :wrench: Options

Default options is `"always"`.

```json
{
  "vue/prefer-true-attribute-shorthand": ["error", "always" | "never"]
}
```

- `"always"` (default) ... requires shorthand form.
- `"never"` ... requires long form.

### `"never"`

<eslint-code-block :rules="{'vue/prefer-true-attribute-shorthand': ['error', 'never']}">

```vue
<template>
  <!-- ✗ BAD -->
  <MyComponent show />

  <!-- ✓ GOOD -->
  <MyComponent :show="true" />
  <MyComponent v-bind:show="true" />
</template>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/no-boolean-default](./no-boolean-default.md)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v8.5.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/prefer-true-attribute-shorthand.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/prefer-true-attribute-shorthand.js)
