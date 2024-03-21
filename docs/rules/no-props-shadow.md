---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-props-shadow
description: disallow shadowing a prop
---
# vue/no-props-shadow

> disallow shadowing a prop

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule disallow shadowing a prop

<eslint-code-block :rules="{'vue/no-props-shadow': ['error']}">

```vue
<script lang="ts" setup>
import { ref } from 'vue';
defineProps<{ foo: { a: string } }>();
{
  /* ✓ GOOD */
  const foo = ref();
}
/* ✗ BAD */
const foo = ref();
/* ✗ BAD */
function foo(){}
/* ✗ BAD */
import foo from 'foo'
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.
