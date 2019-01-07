---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-template-shadow
description: disallow variable declarations from shadowing variables declared in the outer scope
---
# vue/no-template-shadow
> disallow variable declarations from shadowing variables declared in the outer scope

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

`no-template-shadow` should report variable definitions of v-for directives or scope attributes if those shadows the variables in parent scopes.

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
    data () {
      return {
        l: false
      }
    }
  }
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-template-shadow.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-template-shadow.js)
