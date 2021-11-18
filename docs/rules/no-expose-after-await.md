---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-expose-after-await
description: disallow asynchronously registered `expose`
---
# vue/no-expose-after-await

> disallow asynchronously registered `expose`

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule reports the `expose()` after `await` expression.  
In `setup()` function, `expose()` should be registered synchronously.

<eslint-code-block :rules="{'vue/no-expose-after-await': ['error']}">

```vue
<script>
import { watch } from 'vue'
export default {
  async setup(props, { expose }) {
    /* ✓ GOOD */
    expose({/* ... */})

    await doSomething()

    /* ✗ BAD */
    expose({/* ... */})
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Vue RFCs - 0042-expose-api](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0042-expose-api.md)
- [Vue RFCs - 0013-composition-api](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-expose-after-await.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-expose-after-await.js)
