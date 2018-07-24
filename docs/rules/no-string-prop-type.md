# disallow usage of strings as prop types (no-string-prop-type)

...


## Rule Details

This rule aims to...

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

### Options

-

## When Not To Use It

-

## Further Reading

-
