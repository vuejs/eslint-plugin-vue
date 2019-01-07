---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-prop-type-constructor
description: require prop type to be a constructor
---
# vue/require-prop-type-constructor
> require prop type to be a constructor

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports prop types that can't be presumed as constructors.

It's impossible to catch every possible case and know whether the prop type is a constructor or not, hence this rule black list few types of nodes, instead of white-listing correct ones.

The following types are forbidden and will be reported:

- Literal
- TemplateLiteral
- BinaryExpression
- UpdateExpression

It will catch most commonly made mistakes which are using strings instead of constructors.

<eslint-code-block fix :rules="{'vue/require-prop-type-constructor': ['error']}">

```vue
<script>
export default {
  props: {
    /* ✓ GOOD */
    myProp: Number,
    anotherProp: [Number, String],
    myFieldWithBadType: {
      type: Object,
      default: function() {
        return {}
      },
    },
    myOtherFieldWithBadType: {
      type: Number,
      default: 1,
    },
    /* ✗ BAD */
    myProp: "Number",
    anotherProp: ["Number", "String"],
    myFieldWithBadType: {
      type: "Object",
      default: function() {
        return {}
      },
    },
    myOtherFieldWithBadType: {
      type: "Number",
      default: 1,
    },
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further reading

- [Guide - Prop Validation](https://vuejs.org/v2/guide/components-props.html#Prop-Validation)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-prop-type-constructor.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-prop-type-constructor.js)
