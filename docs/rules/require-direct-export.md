---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-direct-export
description: require the component to be directly exported
---
# vue/require-direct-export
> require the component to be directly exported

## :book: Rule Details

This rule aims to require that the component object be directly exported.

<eslint-code-block :rules="{'vue/require-direct-export': ['error']}">

```vue
<script>
/* ✓ GOOD */
export default {
  name: 'ComponentA',
  data() {
    return {
      state: 1
    }
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/require-direct-export': ['error']}">

```vue
<script>
const ComponentA = {
  name: 'ComponentA',
  data() {
    return {
      state: 1
    }
  }
}

/* ✗ BAD */
export default ComponentA
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-direct-export.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-direct-export.js)
