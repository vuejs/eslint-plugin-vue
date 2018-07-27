# require type definitions in props (vue/require-prop-types)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

In committed code, prop definitions should always be as detailed as possible, specifying at least type(s).

## :book: Rule Details

This rule enforces that a `props` statement contains type definition.

:-1: Examples of **incorrect** code for this rule:

```js
props: ['status']
```

:+1: Examples of **correct** code for this rule:

```js
// Without options, just type reference
props: {
  status: String
}
```

```js
// With options with type field
props: {
  status: {
    type: String,
    required: true,
  }
}
```

```js
// With options without type field but with validator field
props: {
  status: {
    required: true,
    validator: function (value) {
      return (
        value === null ||
        Array.isArray(value) && value.length > 0
      )
    }
  }
}
```

## :wrench: Options

Nothing.

## Related links

- [Style guide - Prop definitions](https://vuejs.org/v2/style-guide/#Prop-definitions-essential)
