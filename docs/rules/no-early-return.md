---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-early-return
description: disallow early `return` in `setup`, `data` and `asyncData` functions
---

# vue/no-early-return

> disallow early `return` in `setup`, `data` and `asyncData` functions

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

The `setup` and `data` functions of Vue components (and [`asyncData`](https://nuxt.com/docs/2.x/directory-structure/pages#asyncdata) of Nuxt.js page components) should only have a single (unconditional) return statement at the end. This rule reports early `return` statements, i.e. those that would exit the function early without allowing to reach the end of the function body.

`return` statements inside nested functions, such as callbacks of `computed` or `watch` or local helper functions, are not checked.

<eslint-code-block :rules="{'vue/no-early-return': ['error']}">

```vue
<script>
export default {
  /* ✓ GOOD */
  setup() {
    const count = ref(0)
    const double = computed(() => {
      if (count.value < 0) {
        return 0
      }
      return count.value * 2
    })
    return { count, double }
  },

  /* ✗ BAD */
  data() {
    if (this.initial) {
      return { value: this.initial }
    }
    return { value: null }
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-early-return': ['error']}">

```vue
<script>
export default {
  /* ✗ BAD */
  setup() {
    const user = useUser()
    if (!user.value) {
      return { user }
    }
    const posts = usePosts(user)
    return { user, posts }
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-early-return.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-early-return.test.ts)
