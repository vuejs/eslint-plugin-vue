# require default value for props (require-default-prop)

- :white_check_mark: The `"extends": "plugin:vue/recommended"` property in a configuration file enables this rule.

This rule requires default value to be set for each props that are not marked as `required`.

## Rule Details

Examples of **incorrect** code for this rule:

```js
export default {
  props: {
    a: Number,
    b: [Number, String],
    c: {
      type: Number
    },
    d: {
      type: Number,
      required: false
    }
  }
}
```

Examples of **correct** code for this rule:

```js
export default {
  props: {
    a: {
      type: Number,
      required: true
    },
    b: {
      type: Number,
      default: 0
    },
    c: {
      type: Number,
      default: 0,
      required: false
    }
  }
}
```
