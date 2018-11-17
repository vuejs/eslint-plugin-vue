# require component name property to match its file name (vue/match-component-file-name)

You can define an array of file extensions this rule should verify for 
the component's name.

By default this rule will only verify components in a file with a `.jsx` 
extension.

## :book: Rule Details

This rule reports if a component `name` property does not match its file name.

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

## :wrench: Options

- `{extensions: ['jsx']}` (default) ... verify components in files with `.jsx` extension.
- `{extensions: ['jsx', 'vue', 'js']}` (*or any combinations of these extensions*) 
  ... verify components in files with listed extensions.
