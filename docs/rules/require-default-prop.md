# require default value for props (vue/require-default-prop)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule requires default value to be set for each props that are not marked as `required` (except `Boolean` props).

## Rule Details

Examples of **incorrect** code for this rule:

```js
props: {
  a: Number,
  b: [Number, String],
  c: [Boolean, Number],
  d: {
    type: Number
  },
  e: {
    type: Number,
    required: false
  }
}
```

Examples of **correct** code for this rule:

```js
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
  },
  d: {
    type: Boolean, // Boolean is the only type that doesn't require default
  }
}
```

## Related links

- [Style guide - Prop definitions](https://vuejs.org/v2/style-guide/#Prop-definitions-essential)
