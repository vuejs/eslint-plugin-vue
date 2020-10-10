---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-use-computed-property-like-method
description: disallow use computed property like method
---

# vue/no-use-computed-property-like-method
> disallow use computed property like method

## :book: Rule Details

This rule disallows to use computed property like method.  

<eslint-code-block :rules="{'vue/no-use-computed-property-like-method': ['error']}">

```vue
<template>
  <div>
  </div>
</template>

<script>
  export default {
    props: {
      name: {
        type: String
      },
    },
    computed: {
      isExpectedName() {
        return this.name === 'name';
      }
    },
    methods: {
      getName() {
        return this.isExpectedName
      },
      getNameCallLikeMethod() {
        return this.isExpectedName()
      }
    }
  }
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-use-computed-property-like-method.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-use-computed-property-like-method.js)
