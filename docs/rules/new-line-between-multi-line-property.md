---
pageClass: rule-details
sidebarDepth: 0
title: vue/new-line-between-multi-line-property
description: enforce new lines between multi-line properties in Vue components
---
# vue/new-line-between-multi-line-property
> enforce new lines between multi-line properties in Vue components

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

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

## :wrench: Option
```json
{
  "vue/new-line-between-multiline-property": ["error", {
    "minLineOfMultilineProperty": 2
  }]
}
```
- `minLineOfMultilineProperty` ... `type: number`, Define the minimum number of rows for a multi-line property  .`type:` number, `default:` 2 , `min:`: 2
## :books: Further Reading
Nothing here
## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/new-line-between-multi-line-property.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/new-line-between-multi-line-property.js)
