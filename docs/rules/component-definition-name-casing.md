# enforce specific casing for component definition name (vue/component-definition-name-casing)

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

Define a style for component definition name casing for consistency purposes.

## :book: Rule Details

:+1: Examples of **correct** code for `PascalCase`:

```js
export default {
  name: 'MyComponent'
}
```
```js
Vue.component('MyComponent', {
  
})
```

:+1: Examples of **correct** code for `kebab-case`:

```js
export default {
  name: 'my-component'
}
```
```js
Vue.component('my-component', {
  
})
```

## :wrench: Options

Default casing is set to `PascalCase`.

```json
{
  "vue/component-definition-name-casing": ["error", "PascalCase|kebab-case"]
}
```

## Related links

- [Style guide - Component name casing in JS/JSX](https://vuejs.org/v2/style-guide/#Component-name-casing-in-JS-JSX-strongly-recommended)
