# enforce component's data property to be a function (vue/no-shared-component-data)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

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

```js
export default {
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

```js
export default {
  data () {
    return {
      foo: 'bar'
    }
  }
}
```

## :wrench: Options

Nothing.
