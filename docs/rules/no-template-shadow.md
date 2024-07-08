---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-template-shadow
description: disallow variable declarations from shadowing variables declared in the outer scope
since: v5.0.0
---

# vue/no-template-shadow

> disallow variable declarations from shadowing variables declared in the outer scope

- :gear: This rule is included in all of `"plugin:vue/vue3-strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/strongly-recommended"`, `*.configs["flat/vue2-strongly-recommended"]`, `"plugin:vue/vue3-recommended"`, `*.configs["flat/recommended"]`, `"plugin:vue/recommended"` and `*.configs["flat/vue2-recommended"]`.

`no-template-shadow` should report variable definitions of v-for directives or scope attributes if they shadow the variables in parent scopes.

## :book: Rule Details

This rule aims to eliminate shadowed variable declarations of v-for directives or scope attributes.

<eslint-code-block :rules="{'vue/no-template-shadow': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-for="i in 5"></div>
  <div v-for="j in 5"></div>

  <!-- ✗ BAD -->
  <div>
    <div v-for="k in 5">
      <div v-for="k in 10"></div>
      <div slot-scope="{ k }"></div>
    </div>
  </div>
  <div v-for="l in 5"></div>
</template>

<script>
export default {
  data() {
    return {
      l: false
    }
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

This rule takes one optional object option, with the property `"allow"`.

```json
{
  "no-template-shadow": ["error", { "allow": [] }]
}
```

- `"allow"` (`[string]`) Array of identifier names for which shadowing is allowed.

Examples of correct code for the `{ "allow": ["i"] }` option:

<eslint-code-block :rules="{'vue/no-template-shadow': ['error', { allow: ['i'] }]}">

```vue
<template>
  <div v-for="i in 5"></div>
</template>

<script>
export default {
  data() {
    return {
      i: 'some value'
    }
  }
}
</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v5.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-template-shadow.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-template-shadow.js)
