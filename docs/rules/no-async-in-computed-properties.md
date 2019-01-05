---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-async-in-computed-properties
description: disallow asynchronous actions in computed properties
---
# vue/no-async-in-computed-properties
> disallow asynchronous actions in computed properties

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

Computed properties should be synchronous. Asynchronous actions inside them may not work as expected and can lead to an unexpected behaviour, that's why you should avoid them.
If you need async computed properties you might want to consider using additional plugin [vue-async-computed]

## :book: Rule Details

This rule is aimed at preventing asynchronous methods from being called in computed properties.

<eslint-code-block :rules="{'vue/no-async-in-computed-properties': ['error']}">

```vue
<script>
export default {
  computed: {
    /* ✓ GOOD */
    foo () {
      var bar = 0
      try {
        bar = bar / this.a
      } catch (e) {
        return 0
      } finally {
        return bar
      }
    },

    /* ✗ BAD */
    pro () {
      return Promise.all([new Promise((resolve, reject) => {})])
    },
    foo1: async function () {
      return await someFunc()
    },
    bar () {
      return fetch(url).then(response => {})
    },
    tim () {
      setTimeout(() => { }, 0)
    },
    inter () {
      setInterval(() => { }, 0)
    },
    anim () {
      requestAnimationFrame(() => {})
    }
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further reading

- [vue-async-computed](https://github.com/foxbenjaminfox/vue-async-computed)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-async-in-computed-properties.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-async-in-computed-properties.js)
