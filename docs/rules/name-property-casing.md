# Requires specific casing for the name property in Vue components (name-property-casing)

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
