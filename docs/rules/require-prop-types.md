# require type definitions in props (require-prop-types)

In committed code, prop definitions should always be as detailed as possible, specifying at least type(s).

## :book: Rule Details

This rule enforces that a `props` statement contains type definition.

:-1: Examples of **incorrect** code for this rule:

```js
export default {
  props: ['status']
}
```

:+1: Examples of **correct** code for this rule:

```js
export default {
  props: {
    status: String
  }
}
```

```js
export default {
  props: {
    status: {
      type: String,
      required: true,
      validate: function (value) {
        return ['syncing', 'synced', 'version-conflict', 'error'].indexOf(value) !== -1
      }
    }
  }
}
```
## :wrench: Options

Nothing.
