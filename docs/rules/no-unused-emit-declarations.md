---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-unused-emit-declarations
description: disallow unused emit declarations
---
# vue/no-unused-emit-declarations

> disallow unused emit declarations

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule is aimed at eliminating unused emit declarations.

<eslint-code-block :rules="{'vue/no-unused-emit-declarations': ['error']}">

```vue
<!-- ✗ BAD -->
<script>
  export default {
    emits: ['foo'],
  }
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-unused-emit-declarations': ['error']}">

```vue
<!-- ✓ GOOD -->
<script>
  export default {
    emits: ['foo'],
    methods: {
      foo() {
        this.$emit('foo')
      },
    },
  }
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/require-explicit-emits](./require-explicit-emits.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-unused-emit-declarations.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-unused-emit-declarations.js)
