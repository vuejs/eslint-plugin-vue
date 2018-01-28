# enforce render function to always return value (vue/require-render-return)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule aims to enforce render function to always return value

## :book: Rule Details

:-1: Examples of **incorrect** code for this rule:

```js
export default {
  render () {}
}
```

```js
export default {
  render (h) {
    if (foo) {
      return h('div', 'hello')
    }
  }
}
```

:+1: Examples of **correct** code for this rule:

```js
export default {
  render (h) {
    return h('div', 'hello')
  }
}
```

## :wrench: Options

Nothing.
