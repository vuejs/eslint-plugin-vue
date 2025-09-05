---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-mayberef-unwrap
description: require `MaybeRef` values to be unwrapped with `unref()` before using in conditions
since: v10.3.0
---

# vue/require-mayberef-unwrap

> require unwrapping `MaybeRef` values with `unref()` in conditions

- :gear: This rule is included in all of `"plugin:vue/essential"`, `*.configs["flat/essential"]`, `"plugin:vue/strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/recommended"` and `*.configs["flat/recommended"]`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports cases where a `MaybeRef` value is used incorrectly in conditions.  
You must use `unref()` to access the inner value.

<eslint-code-block fix :rules="{'vue/require-mayberef-unwrap': ['error']}">

```vue
<script lang="ts">
import { ref, unref, type MaybeRef } from 'vue'

export default {
  setup() {
    const maybeRef: MaybeRef<boolean> = ref(false)

    /* ✓ GOOD */
    if (unref(maybeRef)) {
      console.log('good')
    }
    const result = unref(maybeRef) ? 'true' : 'false'

    /* ✗ BAD */
    if (maybeRef) {
      console.log('bad')
    }
    const alt = maybeRef ? 'true' : 'false'

    return {
      maybeRef
    }
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

This rule also applies to `MaybeRefOrGetter` values in addition to `MaybeRef`.

## :books: Further Reading

- [Guide – Reactivity – `unref`](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#unref)
- [API – `MaybeRef`](https://vuejs.org/api/utility-types.html#mayberef)
- [API – `MaybeRefOrGetter`](https://vuejs.org/api/utility-types.html#maybereforgetter)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v10.3.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-mayberef-unwrap.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-mayberef-unwrap.js)
