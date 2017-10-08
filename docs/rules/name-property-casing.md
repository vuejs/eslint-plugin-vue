# enforce specific casing for the name property in Vue components (name-property-casing)

- :white_check_mark: The `"extends": "plugin:vue/recommended"` property in a configuration file enables this rule.
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

:+1: Examples of **correct** code for `camelCase`:

```js
export default {
  name: 'myComponent'
}
```

## :wrench: Options

Default casing is set to `PascalCase`

```
'vue/name-property-casing': [2, 'camelCase|kebab-case|PascalCase']
```
