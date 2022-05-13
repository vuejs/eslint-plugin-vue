---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-early-return
description: disallow early returns in setup and data functions
---
# vue/no-early-return

> disallow early returns in setup and data functions

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule helps to identify accidental `return` statements in the `setup` block of a Vue component, these are `return` statements that would exit the `setup` block skipping part of the block itself (not allowing to each the end of the block).

On the other hand, the rule checks the `data` block too, applying the same logic.

<eslint-code-block :rules="{'vue/no-early-return': ['error']}">

```vue
<!-- ✓ GOOD -->
<script>
  export default {
    setup () {
      const foo = ref()
      return { foo }
    }
  }
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-early-return': ['error']}">

```vue
<!-- ✗ BAD -->
<script>
  export default {
    setup () {
      const foo = ref()

      if (maybe) {
        return
      }

      for (const t of foo.value) {
        if (t) {
          return
        }
      }

      return { foo }
    }
  }
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-early-return': ['error']}">

```vue
<!-- ✓ GOOD -->
<script>
  export default {
    data () {
      return { foo: true }
    }
  }
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-early-return': ['error']}">

```vue
<!-- ✗ BAD -->
<script>
  export default {
    data () {
      if (maybe) {
        return { foo: false }
      }

      return { foo: true }
    }
  }
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-early-return.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-early-return.js)
