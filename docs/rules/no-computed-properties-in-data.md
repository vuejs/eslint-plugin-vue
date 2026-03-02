---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-computed-properties-in-data
description: disallow accessing computed properties in `data`
since: v7.20.0
---

# vue/no-computed-properties-in-data

> disallow accessing computed properties in `data`

- :gear: This rule is included in the following preset configs:
  - `*.configs["flat/essential"]`
  - `*.configs["flat/vue2-essential"]`
  - `*.configs["flat/strongly-recommended"]`
  - `*.configs["flat/vue2-strongly-recommended"]`
  - `*.configs["flat/recommended"]`
  - `*.configs["flat/vue2-recommended"]`
  - `"plugin:vue/essential"`
  - `"plugin:vue/vue2-essential"`
  - `"plugin:vue/strongly-recommended"`
  - `"plugin:vue/vue2-strongly-recommended"`
  - `"plugin:vue/recommended"`
  - `"plugin:vue/vue2-recommended"`

## :book: Rule Details

This rule disallow accessing computed properties in `data()`.\
The computed property cannot be accessed in `data()` because is before initialization.

<eslint-code-block :rules="{'vue/no-computed-properties-in-data': ['error']}">

```vue
<script>
export default {
  data() {
    return {
      /* ✗ BAD */
      bar: this.foo
    }
  },
  computed: {
    foo() {}
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.20.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-computed-properties-in-data.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-computed-properties-in-data.test.ts)
