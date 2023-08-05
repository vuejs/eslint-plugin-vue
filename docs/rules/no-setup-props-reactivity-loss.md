---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-setup-props-reactivity-loss
description: disallow usages that lose the reactivity of `props` passed to `setup`
---
# vue/no-setup-props-reactivity-loss

> disallow usages that lose the reactivity of `props` passed to `setup`

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule reports the destructuring or member expression of `props` passed to `setup` causing the value to lose reactivity.

<eslint-code-block :rules="{'vue/no-setup-props-reactivity-loss': ['error']}">

```vue
<script>
export default {
  /* ✓ GOOD */
  setup(props) {
    watch(() => props.count, () => {
      console.log(props.count)
    })

    return () => {
      return h('div', props.count)
    }
  }
}
</script>
```

</eslint-code-block>

Destructuring the `props` passed to `setup` will cause the value to lose reactivity.

<eslint-code-block :rules="{'vue/no-setup-props-reactivity-loss': ['error']}">

```vue
<script>
export default {
  /* ✗ BAD */
  setup({ count }) {
    watch(() => count, () => { // not going to detect changes
      console.log(count)
    })

    return () => {
      return h('div', count) // not going to update
    }
  }
}
</script>
```

</eslint-code-block>

Also, destructuring in root scope of `setup()` should error, but ok inside nested callbacks or returned render functions:

<eslint-code-block :rules="{'vue/no-setup-props-reactivity-loss': ['error']}">

```vue
<script>
export default {
  setup(props) {
    /* ✗ BAD */
    const { count } = props

    watch(() => props.count, () => {
      /* ✓ GOOD */
      const { count } = props
      console.log(count)
    })

    return () => {
      /* ✓ GOOD */
      const { count } = props
      return h('div', count)
    }
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Guide - Composition API - Setup](https://vuejs.org/api/composition-api-setup.html)
- [Vue RFCs - 0013-composition-api](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-setup-props-reactivity-loss.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-setup-props-reactivity-loss.js)
