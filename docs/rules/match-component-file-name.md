---
pageClass: rule-details
sidebarDepth: 0
title: vue/match-component-file-name
description: require component name property to match its file name
---
# vue/match-component-file-name
> require component name property to match its file name

This rule reports if a component `name` property does not match its file name.

You can define an array of file extensions this rule should verify for 
the component's name.

## :book: Rule Details

This rule has some options.

```json
{
  "vue/match-component-file-name": ["error", {
    "extensions": ["jsx"],
    "shouldMatchCase": false
  }]
}
```

By default this rule will only verify components in a file with a `.jsx` 
extension.

You can use any combination of `".jsx"`, `".vue"` and `".js"` extensions.

You can also enforce same case between the component's name and its file name.

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
// options: {extensions: ["vue"]}
<script>
  export default {
    name: 'MComponent',
    template: '<div />'
  }
</script>
```

```js
// file name: src/MyComponent.js
// options: {extensions: ["js"]}
new Vue({
  name: 'MComponent',
  template: '<div />'
})
```

```js
// file name: src/MyComponent.js
// options: {extensions: ["js"]}
Vue.component('MComponent', {
  template: '<div />'
})
```

```jsx
// file name: src/MyComponent.jsx
// options: {shouldMatchCase: true}
export default {
  name: 'my-component',
  render() { return <div /> }
}
```

```jsx
// file name: src/my-component.jsx
// options: {shouldMatchCase: true}
export default {
  name: 'MyComponent',
  render() { return <div /> }
}
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

```jsx
// file name: src/MyComponent.jsx
// options: {shouldMatchCase: true}
export default {
  name: 'MyComponent',
  render() { return <div /> }
}
```

```jsx
// file name: src/my-component.jsx
// options: {shouldMatchCase: true}
export default {
  name: 'my-component',
  render() { return <div /> }
}
```

## :wrench: Options

```json
{
  "vue/match-component-file-name": ["error", {
    "extensions": ["jsx"],
    "shouldMatchCase": false
  }]
}
```

- `"extensions": []` ... array of file extensions to be verified. Default is set to `["jsx"]`.
- `"shouldMatchCase": false` ... boolean indicating if component's name
  should also match its file name case. Default is set to `false`.

## :books: Further reading

 - [Style guide - Single-file component filename casing](https://vuejs.org/v2/style-guide/#Single-file-component-filename-casing-strongly-recommended)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/match-component-file-name.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/match-component-file-name.js)
