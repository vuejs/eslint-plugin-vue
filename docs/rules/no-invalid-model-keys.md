---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-invalid-model-keys
description: require valid keys in model option
since: v7.9.0
---
# vue/no-invalid-model-keys

> require valid keys in model option

## :book: Rule Details

This rule is aimed at preventing invalid keys in model option.

<eslint-code-block :rules="{'vue/no-invalid-model-keys': ['error']}">

```vue
<script>
/* ✓ GOOD */
export default {
  model: {
    prop: 'list',
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-invalid-model-keys': ['error']}">

```vue
<script>
/* ✓ GOOD */
export default {
  model: {
    event: 'update'
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-invalid-model-keys': ['error']}">

```vue
<script>
/* ✓ GOOD */
export default {
  model: {
    prop: 'list',
    event: 'update'
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-invalid-model-keys': ['error']}">

```vue
<script>
/* ✗ BAD */
export default {
  model: {
    prop: 'list',
    events: 'update'
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-invalid-model-keys': ['error']}">

```vue
<script>
/* ✗ BAD */
export default {
  model: {
    props: 'list',
    events: 'update'
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-invalid-model-keys': ['error']}">

```vue
<script>
/* ✗ BAD */
export default {
  model: {
    name: 'checked',
    props: 'list',
    event: 'update'
  }
}
</script>
```

</eslint-code-block>


## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.9.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-invalid-model-keys.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-invalid-model-keys.js)
