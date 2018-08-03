# require prop type to be a constructor (vue/require-prop-type-constructor)

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule reports prop types that can't be presumed as constructors.

It's impossible to catch every possible case and know whether the prop type is a constructor or not, hence this rule black list few types of nodes, instead of white-listing correct ones.

The following types are forbidden and will be reported:

- Literal
- TemplateLiteral
- BinaryExpression
- UpdateExpression

It will catch most commonly made mistakes which are using strings instead of constructors.

## Rule Details

Examples of **incorrect** code for this rule:

```js
export default {
  props: {
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
```

Examples of **correct** code for this rule:

```js
export default {
  props: {
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
  }
}
```
