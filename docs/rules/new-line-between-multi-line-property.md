---
pageClass: rule-details
sidebarDepth: 0
title: vue/new-line-between-multi-line-property
description: enforce new lines between multi-line properties in Vue components
since: v7.3.0
---
# vue/new-line-between-multi-line-property

> enforce new lines between multi-line properties in Vue components

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule aims at enforcing new lines between multi-line properties in Vue components to help readability

<eslint-code-block fix :rules="{'vue/new-line-between-multi-line-property': ['error']}">

```vue
<script>
/* ✗ BAD */
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    focused: {
      type: Boolean,
      default: false,
      required: true
    },

    label: String,
    icon: String
  },
  computed: {

  }
}
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/new-line-between-multi-line-property': ['error']}">

```vue
<script>
/* ✓ GOOD */
export default {
  props: {
    value: {
      type: String,
      required: true
    },

    focused: {
      type: Boolean,
      default: false,
      required: true
    },

    label: String,
    icon: String
  },

  computed: {
    
  }
}
</script>
```

</eslint-code-block>

## :wrench: Option

```json
{
  "vue/new-line-between-multi-line-property": ["error", {
    "minLineOfMultilineProperty": 2
  }]
}
```

- `minLineOfMultilineProperty` ... Define the minimum number of rows for a multi-line property. default `2`

## :books: Further Reading

- [Style guide - Empty lines in component/instance options](https://vuejs.org/style-guide/rules-recommended.html#empty-lines-in-component-instance-options)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.3.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/new-line-between-multi-line-property.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/new-line-between-multi-line-property.js)
