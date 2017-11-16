# disallow asynchronous actions in computed properties (no-async-in-computed-properties)

Computed properties should be synchronous. Asynchronous actions inside them may not work as expected and can lead to an unexpected behaviour, that's why you should avoid them.
If you need async computed properties you might want to consider using additional plugin [vue-async-computed]

## :book: Rule Details

This rule is aimed at preventing asynchronous methods from being called in computed properties.

:-1: Examples of **incorrect** code for this rule:

```js
computed: {
  pro () {
    return Promise.all([new Promise((resolve, reject) => {})])
  },
  foo: async function () {
    return await someFunc()
  },
  bar () {
    return fetch(url).then(response => {})
  },
  tim () {
    setTimeout(() => { }, 0)
  },
  inter () {
    setInterval(() => { }, 0)
  },
  anim () {
    requestAnimationFrame(() => {})
  }
}
```

:+1: Examples of **correct** code for this rule:

```js
computed: {
  foo () {
    var bar = 0
    try {
      bar = bar / this.a
    } catch (e) {
      return 0
    } finally {
      return bar
    }
  }
}
```

## :wrench: Options

Nothing.


[vue-async-computed]: https://github.com/foxbenjaminfox/vue-async-computed
