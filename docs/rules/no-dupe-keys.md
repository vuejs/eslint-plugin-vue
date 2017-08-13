# disallow duplication of field names (no-dupe-keys)

This rule prevents to use duplicated names.

## :book: Rule Details

This rule is aimed at preventing duplicated property names.

:-1: Examples of **incorrect** code for this rule:

```js
export default {
  props: {
    foo: String
  },
  computed: {
    foo: {
      get () {
      }
    }
  },
  data: {
    foo: null
  },
  methods: {
    foo () {
    }
  }
}
```

:+1: Examples of **correct** code for this rule:

```js
export default {
  props: ['foo'],
  computed: {
    bar () {
    }
  },
  data () {
    return {
      dat: null
    }
  },
  methods: {
    test () {
    }
  }
}
```

## :wrench: Options

This rule has an object option:

`"groups"`: [] (default) array of additional groups to search for duplicates.

### Example:

```
vue/no-dupe-keys: [2, {
  groups: ['asyncComputed']
}]
```

:-1: Examples of **incorrect** code for this configuration

```js
export default {
  computed: {
    foo () {}
  },
  asyncComputed: {
    foo () {}
  }
}
```
