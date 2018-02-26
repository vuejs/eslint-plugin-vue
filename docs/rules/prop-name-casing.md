# enforce specific casing for the Prop name in Vue components (vue/prop-name-casing)

This rule would enforce proper casing of props in vue components(camelCase).

## :book: Rule Details

(https://vuejs.org/v2/style-guide/#Prop-name-casing-strongly-recommended).

:+1: Examples of **correct** code for `camelCase`:

```js
export default {
  props: {
    greetingText: String
  }
}
```

:-1: Examples of **incorrect** code for `camelCase`:

```js
export default {
  props: {
    'greeting-text': String
  }
}
```

## :wrench: Options

Default casing is set to `camelCase`.

```
"vue/prop-name-casing": ["error", "camelCase|snake_case"]
```
