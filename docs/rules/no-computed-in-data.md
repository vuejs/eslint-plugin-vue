---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-computed-in-data
description: disallow computed properties used in the data property
---
# vue/no-computed-in-data
> disallow computed properties used in the data property

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule report computed properties that used in data property

<eslint-code-block :rules="{'vue/no-computed-in-data': ['error']}">

```vue
<script>
export default {
  data() {
    return {
      /* ✓ GOOD */
      value: 'hello ' + 'world',

      /* ✗ BAD */
      a: this.world,
      b: this.world,
      c: [this.world, this.number]
    };
  },
  computed: {
    world() {
      return 'world';
    },
    number() {
      return 1
    }
  },
};
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further reading

[Computed Properties](https://vuejs.org/v2/guide/computed.html#Computed-Caching-vs-Methods)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-computed-in-data.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-computed-in-data.js)
