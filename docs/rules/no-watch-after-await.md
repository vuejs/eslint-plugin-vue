---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-watch-after-await
description: disallow asynchronously registered `watch`
---
# vue/no-watch-after-await
> disallow asynchronously registered `watch`

## :book: Rule Details

This rule reports the `watch()` after `await` expression.  
In `setup()` function, `watch()` should be registered synchronously.

<eslint-code-block :rules="{'vue/no-watch-after-await': ['error']}">

```vue
<script>
import { watch } from 'vue'
export default {
  async setup() {
    /* ✓ GOOD */
    watch(() => { /* ... */ })

    await doSomething()

    /* ✗ BAD */
    watch(() => { /* ... */ })
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

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-watch-after-await.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-watch-after-await.js)
