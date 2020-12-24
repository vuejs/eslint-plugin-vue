---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-reserved-keys
description: disallow overwriting reserved keys
since: v3.9.0
---
# vue/no-reserved-keys

> disallow overwriting reserved keys

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule prevents to use [reserved names](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/utils/vue-reserved.json) to avoid conflicts and unexpected behavior.

<eslint-code-block :rules="{'vue/no-reserved-keys': ['error']}">

```vue
<script>
/* ✗ BAD */
export default {
  props: {
    $el: String
  },
  computed: {
    $on: {
      get () {}
    }
  },
  data: {
    _foo: null
  },
  methods: {
    $nextTick () {}
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-reserved-keys": ["error", {
    "reserved": [],
    "groups": []
  }]
}
```

- `reserved` (`string[]`) ... Array of additional restricted attributes inside `groups`. Default is empty.
- `groups` (`string[]`) ... Array of additional group names to search for duplicates in. Default is empty.

### `"reserved": ["foo", "foo2"], "groups": ["firebase"]`

<eslint-code-block :rules="{'vue/no-reserved-keys': ['error', {reserved: ['foo', 'foo2'], groups: ['firebase']}]}">

```vue
<script>
/* ✗ BAD */
export default {
  computed: {
    foo () {}
  },
  firebase: {
    foo2 () {}
  }
}
</script>
```

</eslint-code-block>

## :books: Further Reading

- [List of reserved keys](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/utils/vue-reserved.json)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v3.9.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-reserved-keys.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-reserved-keys.js)
