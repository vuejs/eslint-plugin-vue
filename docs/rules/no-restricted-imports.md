---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-restricted-imports
description: disallow imports from some `'@vue/*'` packages
---
# vue/no-restricted-imports

> disallow imports from some `'@vue/*'` packages

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Further Reading

- [no-restricted-imports]

[no-restricted-imports]: https://eslint.org/docs/rules/no-restricted-imports

<eslint-code-block :rules="{'vue/no-restricted-imports': ['error']}">

```vue
<script>
  // ✓ GOOD
  import { ref } from 'vue';

  // ✗ BAD
  import { ref } from '@vue/reactivity';
</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v*.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-restricted-imports.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-restricted-imports.js)

<sup>Taken with ❤️ [from ESLint core](https://eslint.org/docs/rules/no-restricted-imports)</sup>