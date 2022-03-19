---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-this-in-before-route-enter
description: disallow `this` usage in a `beforeRouteEnter` method
since: v7.11.0
---
# vue/no-this-in-before-route-enter

> disallow `this` usage in a `beforeRouteEnter` method

## :book: Rule Details

Because lack of `this` in the `beforeRouteEnter` [(docs)](https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards). This behavior isn't obvious, so it's pretty easy to make a `TypeError`. Especially during some refactor.

<eslint-code-block :rules="{'vue/no-this-in-before-route-enter': ['error']}">

```vue
<script>
export default {
  beforeRouteEnter() {
    /* ✗ BAD */
    this.method(); // Uncaught TypeError: Cannot read property 'method' of undefined
    this.attribute = 42;
    if (this.value === 42) {
    }
    this.attribute = this.method();
  }   
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-this-in-before-route-enter': ['error']}">

```vue
<script>
export default {
  beforeRouteEnter() {
    /* ✓ GOOD */
    // anything without this
  }   
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mute: When Not To Use It

When [vue-router](https://router.vuejs.org/) is not installed.

## :books: Further Reading

[vue-router - in-component-guards](https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.11.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-this-in-before-route-enter.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-this-in-before-route-enter.js)
