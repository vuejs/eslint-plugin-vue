---
pageClass: rule-details
sidebarDepth: 0
title: vue/v-on-function-call
description: enforce or forbid parentheses after method calls without arguments in `v-on` directives
---
# vue/v-on-function-call
> enforce or forbid parentheses after method calls without arguments in `v-on` directives

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule aims to enforce to bind methods to `v-on` or call methods on `v-on` when without arguments.

<eslint-code-block fix :rules="{'vue/v-on-function-call': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button v-on:click="closeModal">
    Close
  </button>

  <!-- ✗ BAD -->
  <button v-on:click="closeModal()">
    Close
  </button>
</template>
```

</eslint-code-block>

## :wrench: Options

Default is set to `never`.

```json
{
  "vue/v-on-function-call": ["error", "always"|"never"]
}
```

### `"always"` - Always use parentheses in `v-on` directives

<eslint-code-block fix :rules="{'vue/v-on-function-call': ['error', 'always']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button v-on:click="closeModal()">
    Close
  </button>

  <!-- ✗ BAD -->
  <button v-on:click="closeModal">
    Close
  </button>
</template>
```

</eslint-code-block>

### `"never"` - Never use parentheses in `v-on` directives for method calls without arguments


<eslint-code-block fix :rules="{'vue/v-on-function-call': ['error', 'never']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button v-on:click="closeModal">
    Close
  </button>
  <button v-on:click="closeModal(arg)">
    Close
  </button>

  <!-- ✗ BAD -->
  <button v-on:click="closeModal()">
    Close
  </button>
</template>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/v-on-function-call.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/v-on-function-call.js)
