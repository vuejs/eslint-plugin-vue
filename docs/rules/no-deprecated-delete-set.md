---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-delete-set
description: disallow using deprecated `$delete` and `$set` (in Vue.js 3.0.0+)
since: v9.29.0
---

# vue/no-deprecated-delete-set

> disallow using deprecated `$delete` and `$set` (in Vue.js 3.0.0+)

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `*.configs["flat/essential"]`, `"plugin:vue/vue3-strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/vue3-recommended"` and `*.configs["flat/recommended"]`.

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

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.29.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-delete-set.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-delete-set.js)
