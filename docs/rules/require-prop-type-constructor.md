# require prop type to be a constructor (vue/require-prop-type-constructor)

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule makes sure that the types used to defined props are constructors.


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
