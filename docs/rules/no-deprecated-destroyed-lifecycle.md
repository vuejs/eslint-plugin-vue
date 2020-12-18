---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-destroyed-lifecycle
description: disallow using deprecated `destroyed` and `beforeDestroy` lifecycle hooks (in Vue.js 3.0.0+)
---
# vue/no-deprecated-destroyed-lifecycle
> disallow using deprecated `destroyed` and `beforeDestroy` lifecycle hooks (in Vue.js 3.0.0+)

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.

## :book: Rule Details

This rule reports use of deprecated `destroyed` and `beforeDestroy` lifecycle hooks. (in Vue.js 3.0.0+).

<eslint-code-block :rules="{'vue/no-deprecated-destroyed-lifecycle': ['error']}">

```vue
<script>
export default {
  /* ✓ GOOD */
  beforeMount () {},
  mounted () {},
  beforeUnmount () {},
  unmounted () {},

  /* ✗ BAD */
  beforeDestroy () {},
  destroyed () {}
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-destroyed-lifecycle.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-destroyed-lifecycle.js)
