---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-computed-in-data
description: require computed properties are not used in the data()
---
# vue/no-computed-in-data
> require computed properties are not used in the data()

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

> require computed properties are not used in the data()

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

Please describe the origin of the rule here.

## :book: Rule Details

This rule report computed properties are used in data property

Examples of **incorrect** code for this rule:

<eslint-code-block :rules="{'vue/no-computed-in-data': ['error']}">

```vue
<script>
export default {
  data() {
    return {
      value: 'hello ' + this.world,
      a: this.world,
      b: this.world,
    };
  },
  computed: {
    world() {
      return 'world';
    },
  },
};
</script>
```

</eslint-code-block>

Examples of **correct** code for this rule:

<eslint-code-block :rules="{'vue/no-computed-in-data': ['error']}">

```vue
<script>
export default {
  data() {
    return {
      value: 'hello ' + 'world',
    };
  },
  computed: {
    world() {
      return 'world';
    },
  },
};
</script>
```

</eslint-code-block>

## :wrench: Options

nothing

## Further Reading

[Computed Properties](https://vuejs.org/v2/guide/computed.html#Computed-Caching-vs-Methods)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-computed-in-data.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-computed-in-data.js)
