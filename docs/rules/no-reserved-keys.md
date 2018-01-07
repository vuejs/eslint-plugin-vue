# disallow overwriting reserved keys (vue/no-reserved-keys)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule prevents to use reserved names from to avoid conflicts and unexpected behavior.

## Rule Details

:-1: Examples of **incorrect** code for this rule:

```js
export default {
  props: {
    $el: String
  },
  computed: {
    $on: {
      get () {}
    }
  },
  data: {
    _foo: null
  },
  methods: {
    $nextTick () {}
  }
}
```

## :wrench: Options

This rule has an object option:

`"reserved"`: [] (default) array of dissalowed names inside `groups`.

`"groups"`: [] (default) array of additional groups to search for duplicates.

### Example:

``` json
"vue/no-reserved-keys": [2, {
  reserved: ['foo', 'foo2'],
  groups: ['firebase']
}]
```

:-1: Examples of **incorrect** code for this configuration

```js
export default {
  computed: {
    foo () {}
  },
  firebase: {
    foo2 () {}
  }
}
```
