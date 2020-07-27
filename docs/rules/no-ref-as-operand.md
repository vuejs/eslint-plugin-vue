---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-ref-as-operand
description: disallow use of value wrapped by `ref()` (Composition API) as an operand
---
# vue/no-ref-as-operand
> disallow use of value wrapped by `ref()` (Composition API) as an operand

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.

## :book: Rule Details

This rule reports cases where a ref is used incorrectly as an operand.  
You must use `.value` to access the `Ref` value.

<eslint-code-block :rules="{'vue/no-ref-as-operand': ['error']}">

```vue
<script>
import { ref } from 'vue'

export default {
  setup () {
    const count = ref(0)
    const ok = ref(true)

    /* ✓ GOOD */
    count.value++
    count.value + 1
    1 + count.value
    var msg = ok.value ? 'yes' : 'no'

    /* ✗ BAD */
    count++
    count + 1
    1 + count
    var msg = ok ? 'yes' : 'no'

    return {
      count
    }
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Guide - Reactivity - Reactivity Fundamentals / Creating Standalone Reactive Values as `refs`](https://v3.vuejs.org/guide/reactivity-fundamentals.html#creating-standalone-reactive-values-as-refs)
- [Vue RFCs - 0013-composition-api](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-ref-as-operand.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-ref-as-operand.js)
