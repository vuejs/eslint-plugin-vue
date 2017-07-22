# Enforces component's data property to be a function (no-shared-component-data)

When using the data property on a component (i.e. anywhere except on `new Vue`), the value must be a function that returns an object.

## :book: Rule Details

When the value of `data` is an object, it’s shared across all instances of a component.

:-1: Examples of **incorrect** code for this rule:

```js
Vue.component('some-comp', {
  data: {
    foo: 'bar'
  }
})
```

:+1: Examples of **correct** code for this rule:

```js
Vue.component('some-comp', {
  data: function () {
    return {
      foo: 'bar'
    }
  }
})
```

## :wrench: Options

Nothing.
