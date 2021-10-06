---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-computed-properties-in-data
description: disallow accessing computed properties in `data`.
---
# vue/no-computed-properties-in-data

> disallow accessing computed properties in `data`.

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule disallow accessing computed properties in `data()`.  
The computed property cannot be accessed in `data()` because is before initialization.

<eslint-code-block :rules="{'vue/no-computed-properties-in-data': ['error']}">

```vue
<script>
export default {
  data() {
    return  {
      /* ✗ BAD */
      bar: this.foo
    }
  },
  computed: {
    foo () {}
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-computed-properties-in-data.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-computed-properties-in-data.js)
