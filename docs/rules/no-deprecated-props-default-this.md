---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-props-default-this
description: disallow props default function `this` access
since: v7.0.0
---
# vue/no-deprecated-props-default-this

> disallow props default function `this` access

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.

## :book: Rule Details

This rule reports the use of `this` within the props default value factory functions.
In Vue.js 3.0.0+, props default value factory functions no longer have access to `this`.

See [Migration Guide - Props Default Function `this` Access](https://v3.vuejs.org/guide/migration/props-default-this.html) for more details.

<eslint-code-block :rules="{'vue/no-deprecated-props-default-this': ['error']}">

```vue
<script>
export default {
  props: {
    a: String,
    b: {
      default () {
        /* ✗ BAD */
        return this.a
      }
    }
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-deprecated-props-default-this': ['error']}">

```vue
<script>
export default {
  props: {
    a: String,
    b: {
      default (props) {
        /* ✓ GOOD */
        return props.a
      }
    }
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Migration Guide - Props Default Function `this` Access](https://v3.vuejs.org/guide/migration/props-default-this.html)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-props-default-this.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-props-default-this.js)
