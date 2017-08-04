# Enforces render function to always return value (require-render-return)

This rule aims to enforce render function to allways return value

## :book: Rule Details

:-1: Examples of **incorrect** code for this rule:

```js
export default {
  render () {
  }
}
```
```js
export default {
  render (h) {
    if (foo) {
      return
    }
  }
}
```

:+1: Examples of **correct** code for this rule:

```js
export default {
  render (h) {
    return
  }
}
```

## :wrench: Options

Nothing.
