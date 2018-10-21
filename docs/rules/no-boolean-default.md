# Prevents boolean defaults from being set (vue/no-boolean-default)

The rule prevents Boolean props from having a default value.


## :book: Rule Details
The rule is to enforce the HTML standard of always defaulting boolean attributes to false.

Examples of **incorrect** code for this rule:
```js
export default {
  props: {
    foo: {
      type: Boolean,
      default: true
    }
  }
}
```

Examples of **correct** code for this rule:
```js
export default {
  props: {
    foo: Boolean
  }
}
```


## :wrench: Options
- `'constructor'` (default) enforces that Boolean props must use the constructor.
- `'no-default'` allows a prop definition object, but enforces that the `default` property not be defined.
- `'default-fase'` enforces that the default can be set but must be set to `false`.

```json
  "vue/no-boolean-default": ["error", "constructor|no-default|default-fase"]
```

