# enforce specific casing for the name property in Vue components (vue/name-property-casing)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

Define a style for the `name` property casing for consistency purposes.

## :book: Rule Details

:+1: Examples of **correct** code for `PascalCase`:

```js
export default {
  name: 'MyComponent'
}
```

:+1: Examples of **correct** code for `kebab-case`:

```js
export default {
  name: 'my-component'
}
```

## :wrench: Options

Default casing is set to `PascalCase`.

```
"vue/name-property-casing": ["error", "PascalCase|kebab-case"]
```

## Related links

- [Style guide - Component name casing in JS/JSX](https://vuejs.org/v2/style-guide/#Component-name-casing-in-JS-JSX-strongly-recommended)
