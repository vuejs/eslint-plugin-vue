---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-restricted-component-names
description: disallow specific component names
since: v9.15.0
---
# vue/no-restricted-component-names

> disallow specific component names

- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

This rule allows you to specify component names that you don't want to use in your application.

<eslint-code-block :rules="{'vue/no-restricted-component-names': ['error', 'Disallow']}">

```vue
<!-- ✗ BAD -->
<script>
export default {
  name: 'Disallow',
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-restricted-component-names': ['error', 'Disallow']}">

```vue
<!-- ✓ GOOD -->
<script>
export default {
  name: 'Allow',
}
</script>
```

</eslint-code-block>

## :wrench: Options

This rule takes a list of strings, where each string is a component name or pattern to be restricted:

```json
{
  "vue/no-restricted-component-names": ["error", "foo", "/^Disallow/"]
}
```

Alternatively, you can specify an object with a `name` property and an optional `message` and `suggest` property:
  
```json
  {
    "vue/no-restricted-component-names": [
      "error",
      {
        "name": "Disallow",
        "message": "Please do not use `Disallow` as a component name",
        "suggest": "allow"
      },
      {
        "name": "/^custom/",
        "message": "Please do not use component names starting with 'custom'"
      }
    ]
  }
  ```

<eslint-code-block :rules="{'vue/no-restricted-component-names': ['error', { name: 'Disallow', message: 'Please do not use \'Disallow\' as a component name', suggest: 'allow'}]}">

```vue
<!-- ✗ BAD -->
<script>
export default {
  name: 'Disallow',
}
</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.15.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-restricted-component-names.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-restricted-component-names.js)
