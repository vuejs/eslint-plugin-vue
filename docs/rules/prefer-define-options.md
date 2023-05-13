---
pageClass: rule-details
sidebarDepth: 0
title: vue/prefer-define-options
description: enforce use of `defineOptions` instead of default export.
---
# vue/prefer-define-options

> enforce use of `defineOptions` instead of default export.

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule aims to enforce use of `defineOptions` instead of default export in `<script setup>`.

The [`defineOptions()`](https://vuejs.org/api/sfc-script-setup.html#defineoptions) macro was officially introduced in Vue 3.3.

<eslint-code-block fix :rules="{'vue/prefer-define-options': ['error']}">

```vue
<script setup>
/* ✓ GOOD */
defineOptions({ name: 'Foo' })
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/prefer-define-options': ['error']}">

```vue
<script>
/* ✗ BAD */
export default { name: 'Foo' }
</script>
<script setup>
/* ... */
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [API - defineOptions()](https://vuejs.org/api/sfc-script-setup.html#defineoptions)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/prefer-define-options.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/prefer-define-options.js)
