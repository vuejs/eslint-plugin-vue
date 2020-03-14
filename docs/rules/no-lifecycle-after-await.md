---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-lifecycle-after-await
description: disallow asynchronously registered lifecycle hooks
---
# vue/no-lifecycle-after-await
> disallow asynchronously registered lifecycle hooks

## :book: Rule Details

This rule reports the lifecycle hooks after `await` expression.  
In `setup()` function, `onXXX` lifecycle hooks should be registered synchronously.

<eslint-code-block :rules="{'vue/no-lifecycle-after-await': ['error']}">

```vue
<script>
import { onMounted } from 'vue'
export default {
  async setup() {
    /* ✓ GOOD */
    onMounted(() => { /* ... */ })

    await doSomething()

    /* ✗ BAD */
    onMounted(() => { /* ... */ })
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further reading

- [Vue RFCs - 0013-composition-api](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-lifecycle-after-await.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-lifecycle-after-await.js)
