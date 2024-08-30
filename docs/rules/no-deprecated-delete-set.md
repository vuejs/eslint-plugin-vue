---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-delete-set
description: disallow using deprecated `$delete` and `$set` (in Vue.js 3.0.0+)
---

# vue/no-deprecated-delete-set

> disallow using deprecated `$delete` and `$set` (in Vue.js 3.0.0+)

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule reports use of deprecated `$delete` and `$set`. (in Vue.js 3.0.0+).

<eslint-code-block :rules="{'vue/no-deprecated-delete-set': ['error']}">

```vue
<script>
  import { set, del } from 'vue'
  export default {
    mounted () {
      /* ✗ BAD */
      this.$set(obj, key, value)
      this.$delete(obj, key)

      Vue.set(obj, key, value)
      Vue.delete(obj, key)

      set(obj, key, value)
      del(obj, key)
    }
  }
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Migration Guide - Removed APIs](https://v3-migration.vuejs.org/breaking-changes/#removed-apis)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-delete-set.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-delete-set.js)
