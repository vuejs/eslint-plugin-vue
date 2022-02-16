---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-dollar-scopedslots-api
description: disallow using deprecated `$scopedSlots` (in Vue.js 3.0.0+)
since: v7.0.0
---
# vue/no-deprecated-dollar-scopedslots-api

> disallow using deprecated `$scopedSlots` (in Vue.js 3.0.0+)

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports use of deprecated `$scopedSlots`. (in Vue.js 3.0.0+).

See [Migration Guide - Slots Unification](https://v3-migration.vuejs.org/breaking-changes/slots-unification.html) for more details.

<eslint-code-block fix :rules="{'vue/no-deprecated-dollar-scopedslots-api': ['error']}">

```vue
<template>
  <!-- ✗ BAD -->
  <div v-if="$scopedSlots.default"><slot /></div>
</template>
<script>
export default {
  render() {
    /* ✗ BAD */
    return this.$scopedSlots.default()
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Migration Guide - Slots Unification](https://v3-migration.vuejs.org/breaking-changes/slots-unification.html)
- [Vue RFCs - 0006-slots-unification](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0006-slots-unification.md)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-dollar-scopedslots-api.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-dollar-scopedslots-api.js)
