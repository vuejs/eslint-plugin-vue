# require component name property to match its file name (vue/match-component-file-name)

This rule reports if a component `name` property does not match its file name.

You can define an array of file extensions this rule should verify for 
the component's name.

## :book: Rule Details

This rule has some options.

```json
{
  "vue/match-component-file-name": ["error", {
    "extensions": ["jsx"]
  }]
}
```

By default this rule will only verify components in a file with a `.jsx` 
extension.

You can use any combination of `".jsx"`, `".vue"` and `".js"` extensions with this option.

If you are defining multiple components within the same file, this rule will be ignored.

:-1: Examples of **incorrect** code for this rule:

```jsx
// file name: src/MyComponent.jsx
export default {
  name: 'MComponent', // note the missing y
  render: () {
    return <h1>Hello world</h1>
  }
}
```

```vue
// file name: src/MyComponent.vue
<script>
  export default {
    name: 'MComponent',
    template: '<div />'
  }
</script>
```

```js
// file name: src/MyComponent.js
new Vue({
  name: 'MComponent',
  template: '<div />'
})
```

```js
// file name: src/MyComponent.js
Vue.component('MComponent', {
  template: '<div />'
})
```

:+1: Examples of **correct** code for this rule:

```jsx
// file name: src/MyComponent.jsx
export default {
  name: 'MyComponent',
  render: () {
    return <h1>Hello world</h1>
  }
}
```

```jsx
// file name: src/MyComponent.jsx
// no name property defined
export default {
  render: () {
    return <h1>Hello world</h1>
  }
}
```

```vue
// file name: src/MyComponent.vue
<script>
  export default {
    name: 'MyComponent',
    template: '<div />'
  }
</script>
```

```vue
// file name: src/MyComponent.vue
<script>
  export default {
    template: '<div />'
  }
</script>
```

```js
// file name: src/MyComponent.js
new Vue({
  name: 'MyComponent',
  template: '<div />'
})
```

```js
// file name: src/MyComponent.js
new Vue({
  template: '<div />'
})
```

```js
// file name: src/MyComponent.js
Vue.component('MyComponent', {
  template: '<div />'
})
```

```js
// file name: src/components.js
// defines multiple components, so this rule is ignored
Vue.component('MyComponent', {
  template: '<div />'
})

Vue.component('OtherComponent', {
  template: '<div />'
})

new Vue({
  name: 'ThirdComponent',
  template: '<div />'
})
```

## :wrench: Options

- `{extensions: ["jsx"]}` (default) ... verify components in files with `.jsx` extension.
- `{extensions: ["vue"]}` (default) ... verify components in files with `.vue` extension.
- `{extensions: ["js"]}` (default) ... verify components in files with `.js` extension.
- `{extensions: ["jsx", "vue"]}` ... verify components in files with `.jsx` or `.vue` extensions.
- `{extensions: ["jsx", "js"]}` ... verify components in files with `.jsx` or `.js` extensions.
- `{extensions: ["vue", "js"]}` ... verify components in files with `.vue` or `.js` extensions.
- `{extensions: ["jsx", "vue", "js"]}` ... verify components in files with any of the 
  provided extensions.
