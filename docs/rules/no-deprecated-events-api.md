---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-events-api
description: disallow using deprecated events api (in Vue.js 3.0.0+)
---
# vue/no-deprecated-events-api
> disallow using deprecated events api (in Vue.js 3.0.0+)

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.

## :book: Rule Details

This rule reports use of deprecated `$on`, `$off` `$once` api. (in Vue.js 3.0.0+).

<eslint-code-block :rules="{'vue/no-deprecated-events-api': ['error']}">

```vue
<script>
/* ✗ BAD */
export default {
  mounted () {
    this.$on('start', function(args) {
      console.log('start')
    })
    this.$emit('start')
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-deprecated-events-api': ['error']}">

```vue
<script>
/* ✓ GOOD */
import mitt from 'mitt'
const emitter = mitt()
export default {
  mounted () {
    emitter.on('start', function(args) {
      console.log('start')
    })
    emitter.emit('start')
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Vue RFCs - 0020-events-api-change](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0020-events-api-change.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-events-api.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-events-api.js)
