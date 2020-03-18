---
pageClass: rule-details
sidebarDepth: 0
title: vue/new-line-between-multi-line-property
description: enforce new lines between multi-line properties in Vue components
---
# vue/new-line-between-multi-line-property
> enforce new lines between multi-line properties in Vue components

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule aims at enforcing new lines between multi-line properties in Vue components to help readability

Examples of **incorrect** code for this rule:

<eslint-code-block fix :rules="{'vue/new-line-between-multi-line-property': ['error']}">

```vue
<script>
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


Examples of **correct** code for this rule:

<eslint-code-block fix :rules="{'vue/new-line-between-multi-line-property': ['error']}">

```vue
<script>
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

## Options

If there are any options, describe them here. Otherwise, delete this section.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/new-line-between-multi-line-property.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/new-line-between-multi-line-property.js)
