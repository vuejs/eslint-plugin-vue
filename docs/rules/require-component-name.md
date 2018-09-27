# Require components to have names (vue/require-component-name)

- :gear: This rule is included in `"plugin:vue/recommended"`.

## :book: Rule Details

This rule requires components to have names.

:-1: Examples of **incorrect** code for this rule:

```js
export default {
    data() {
        return {};
    },
    created() {},
}
```

:+1: Examples of **correct** code for this rule:

```js
export default {
    name: 'my-component',
    data() {
        return {};
    },
    created() {},
}
```
