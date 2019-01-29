---
pageClass: rule-details
sidebarDepth: 0
title: vue/return-in-computed-property
description: enforce that a return statement is present in computed property
---
# vue/return-in-computed-property
> enforce that a return statement is present in computed property

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule enforces that a `return` statement is present in `computed` properties.

<eslint-code-block :rules="{'vue/return-in-computed-property': ['error']}">

```vue
<script>
export default {
  computed: {
    /* ✓ GOOD */
    foo () {
      if (this.bar) {
        return this.baz
      } else {
        return this.baf
      }
    },
    bar: function () {
      return false
    },
    /* ✗ BAD */
    baz () {
      if (this.baf) {
        return this.baf
      }
    },
    baf: function () {}
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/return-in-computed-property": ["error", {
    "treatUndefinedAsUnspecified": true
  }]
}
```

This rule has an object option:
- `"treatUndefinedAsUnspecified"`: `true` (default) disallows implicitly returning undefined with a `return` statement.

### `treatUndefinedAsUnspecified: false`

<eslint-code-block :rules="{'vue/return-in-computed-property': ['error', { treatUndefinedAsUnspecified: false }]}">

```vue
<script>
export default {
  computed: {
    /* ✓ GOOD */
    foo () {
      if (this.bar) {
        return undefined
      } else {
        return
      }
    },
    bar: function () {
      return
    },
    /* ✗ BAD */
    baz () {
      if (this.baf) {
        return this.baf
      }
    },
    baf: function () {}
  }
}
</script>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/return-in-computed-property.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/return-in-computed-property.js)
