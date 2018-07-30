# disallow side effects in computed properties (vue/no-side-effects-in-computed-properties)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

It is considered a very bad practice to introduce side effects inside computed properties. It makes the code not predictable and hard to understand.


## Rule Details

Examples of **incorrect** code for this rule:

```js
computed: {
  fullName () {
    this.firstName = 'lorem' // <- side effect
    return `${this.firstName} ${this.lastName}`
  },
  reversedArray () {
    return this.array.reverse() // <- side effect - orginal array is being mutated
  }
}
```

Examples of **correct** code for this rule:

```js
computed: {
  fullName () {
    return `${this.firstName} ${this.lastName}`
  },
  reversedArray () {
    return this.array.slice(0).reverse() // .slice makes a copy of the array, instead of mutating the orginal
  }
}
```
