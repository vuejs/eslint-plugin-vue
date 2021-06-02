# vue/no-this-in-before-route-enter

> This rule prevents usage this in the "beforeRouteEnter" because this is undefined there. https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards

## Rule Details

Bad:
```js
<script>
export default {
  beforeRouteEnter() {
    this.method(); // Uncaught TypeError: Cannot read property 'method' of undefined      
  }   
}
</script>
```

Bad:
```js
<script>
export default {
  beforeRouteEnter() {
    this.attribute = 42;
  }   
}
</script>
```

Bad:
```js
<script>
export default {
  beforeRouteEnter() {
    if (this.value === 42) {
        
    }
  }   
}
</script>
```

Good:
```js
<script>
export default {
  beforeRouteEnter() {
    // anything without this
  }   
}
</script>
```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

[vue-router - in-component-guards](https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards)

## :rocket: Version

This rule was introduced in eslint-plugin-vue 7.11.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-this-in-before-route-enter.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-this-in-before-route-enter.js)
