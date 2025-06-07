---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-import-compiler-macros
description: disallow importing Vue compiler macros
since: v10.0.0
---

# vue/no-import-compiler-macros

> disallow importing Vue compiler macros

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule disallow importing vue compiler macros.

<eslint-code-block fix :rules="{'vue/no-import-compiler-macros': ['error']}">

```vue
<script setup>
/* ✗ BAD */
import { defineProps, withDefaults } from 'vue'
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/no-import-compiler-macros': ['error']}">

```vue
<script setup>
/* ✓ GOOD */
import { ref } from 'vue'
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [defineProps() & defineEmits()]

[defineProps() & defineEmits()]: https://vuejs.org/api/sfc-script-setup.html#defineprops-defineemits

## :rocket: Version

This rule was introduced in eslint-plugin-vue v10.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-import-compiler-macros.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-import-compiler-macros.js)
