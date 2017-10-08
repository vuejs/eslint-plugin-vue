# disallow side effects in computed properties (no-side-effects-in-computed-properties)

- :white_check_mark: The `"extends": "plugin:vue/recommended"` property in a configuration file enables this rule.

It is considered a very bad practice to introduce side effects inside computed properties. It makes the code not predictable and hard to understand.


## Rule Details

Examples of **incorrect** code for this rule:

```js

export default {
  computed: {
    fullName() {
      this.firstName = 'lorem' // <- side effect
      return `${this.firstName} ${this.lastName}`
    },
    somethingReversed() {
      return this.something.reverse() // <- side effect
    }
  }
}

```

Examples of **correct** code for this rule:

```js

export default {
  computed: {
    fullName() {
      return `${this.firstName} ${this.lastName}`
    },
    somethingReversed() {
      return this.something.slice(0).reverse()
    }
  }
}

```
