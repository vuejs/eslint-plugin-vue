# enforce render function to always return value (vue/require-render-return)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule aims to enforce render function to always return value

:-1: Examples of **incorrect** code for this rule:

<eslint-code-block :rules="{'vue/require-render-return': ['error']}">
```vue
<script>
export default {
  render (h) {
    if (foo) {
      return h('div', 'hello')
    }
  }
}
</script>
```
</eslint-code-block>

:+1: Examples of **correct** code for this rule:

<eslint-code-block :rules="{'vue/require-render-return': ['error']}">
```vue
<script>
export default {
  render (h) {
    return h('div', 'hello')
  }
}
</script>
```
</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further reading

- [Guide - Render Functions & JSX](https://vuejs.org/v2/guide/render-function.html)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-render-return.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-render-return.js)
