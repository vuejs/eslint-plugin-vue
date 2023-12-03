---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-dupe-keys
description: disallow duplication of field names
since: v3.9.0
---
# vue/no-dupe-keys

> disallow duplication of field names

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

This rule prevents using duplicate key names.

## :book: Rule Details

This rule prevents duplicate `props`/`data`/`methods`/etc. key names defined on a component.
Even if a key name does not conflict in the `<script>` tag itself, it still may lead to a conflict in the `<template>` since Vue allows directly accessing these keys from there.

<eslint-code-block :rules="{'vue/no-dupe-keys': ['error']}">

```vue
<script>
/* ✗ BAD */
export default {
  props: {
    foo: String
  },
  computed: {
    foo: {
      get () {}
    }
  },
  data: {
    foo: null
  },
  methods: {
    foo () {}
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-dupe-keys": ["error", {
    "groups": []
  }]
}
```

- `"groups"` (`string[]`) Array of additional groups to search for duplicates. Default is empty.

### `"groups": ["firebase"]`

<eslint-code-block :rules="{'vue/no-dupe-keys': ['error', {groups: ['firebase']}]}">

```vue
<script>
/* ✗ BAD */
export default {
  computed: {
    foo () {}
  },
  firebase: {
    foo () {}
  }
}
</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v3.9.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-dupe-keys.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-dupe-keys.js)
