---
pageClass: rule-details
sidebarDepth: 0
title: vue/order-in-computed
description: enforce order of computed properties.
---
# vue/order-in-computed

> enforce order of computed properties.

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule ....

<eslint-code-block :rules="{'vue/order-in-computed': ['error']}">

```vue
<script>
/* ✓ GOOD */
export default {
  computed: {
    ...mapGetters({ test: 'getTest' }),
    ...mapState({ status: state => state.status }),
    baz: {
      get() { return 'bar' },
      set(newValue) { this.something = newValue }
    },
    foo () { return 0 },
    bar () { return 1 }
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/order-in-computed': ['error']}">

```vue
<script>
/* ✗ BAD */
export default {
  computed: {
    foo () { return 0 },
    ...mapGetters({ test: 'getTest' }),
    bar () { return 1 },
    baz: {
      get() { return 'bar' },
      set(newValue) { this.something = newValue }
    },
    ...mapState({ status: state => state.status })
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/order-in-computed": ["error", {
    "order": ['MAP_GETTERS', 'MAP_STATE', 'GETTERS_SETTERS', 'NORMAL']
  }]
}
```

- `order` (`string[]`) ... The order of computed properties. default `['MAP_GETTERS', 'MAP_STATE', 'GETTERS_SETTERS', 'NORMAL']`.

### `{ "order": ['MAP_GETTERS', 'MAP_STATE', 'GETTERS_SETTERS', 'NORMAL'] }`

<eslint-code-block :rules="{'vue/order-in-computed': ['error', {'order': ['MAP_GETTERS', 'MAP_STATE', 'GETTERS_SETTERS', 'NORMAL']}]}">

```vue
<script>
/* ✗ BAD */
export default {
  computed: {
    foo () { return 0 },
    ...mapGetters({ test: 'getTest' }),
    bar () { return 1 },
    baz: {
      get() { return 'bar' },
      set(newValue) { this.something = newValue }
    },
    ...mapState({ status: state => state.status })
  }
}
</script>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/order-in-computed.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/order-in-computed.js)
