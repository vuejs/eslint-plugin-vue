---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-model-definition
description: require valid keys in model option
---
# vue/valid-model-definition

> require valid keys in model option

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule is aimed at preventing invalid keys in model option.

<eslint-code-block :rules="{'vue/valid-model-definition': ['error']}">

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

<eslint-code-block :rules="{'vue/valid-model-definition': ['error']}">

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

<eslint-code-block :rules="{'vue/valid-model-definition': ['error']}">

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

<eslint-code-block :rules="{'vue/valid-model-definition': ['error']}">

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

<eslint-code-block :rules="{'vue/valid-model-definition': ['error']}">

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

<eslint-code-block :rules="{'vue/valid-model-definition': ['error']}">

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

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-model-definition.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-model-definition.js)
