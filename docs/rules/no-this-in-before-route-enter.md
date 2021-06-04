---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-this-in-before-route-enter
description: disallow this usage in a beforeRouteEnter method
---
# vue/no-this-in-before-route-enter

> disallow this usage in a beforeRouteEnter method

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## Rule Details

Because lack of `this` in the `beforeRouteEnter` [(docs)](https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards). This behavior isn't obvious, so it's pretty easy to make a `TypeError`. Especially during some refactor. 

Bad:

<eslint-code-block :rules="{'vue/no-this-in-before-route-enter': ['error']}">

```vue
<script>
export default {
  beforeRouteEnter() {
    this.method(); // Uncaught TypeError: Cannot read property 'method' of undefined      
  }   
}
</script>
```

</eslint-code-block>

Bad:

<eslint-code-block :rules="{'vue/no-this-in-before-route-enter': ['error']}">

```vue
<script>
export default {
  beforeRouteEnter() {
    this.attribute = 42;
  }   
}
</script>
```

</eslint-code-block>

Bad:

<eslint-code-block :rules="{'vue/no-this-in-before-route-enter': ['error']}">

```vue
<script>
export default {
  beforeRouteEnter() {
    if (this.value === 42) {
        
    }
  }   
}
</script>
```

</eslint-code-block>


Bad:

<eslint-code-block :rules="{'vue/no-this-in-before-route-enter': ['error']}">

```vue
<script>
export default {
  beforeRouteEnter() {
    this.attribute = this.method();
  }   
}
</script>
```

</eslint-code-block>

Good:

<eslint-code-block :rules="{'vue/no-this-in-before-route-enter': ['error']}">

```vue
<script>
export default {
  beforeRouteEnter() {
    // anything without this
  }   
}
</script>
```

</eslint-code-block>

### Options

Nothing.

## When Not To Use It

When [vue-router](https://router.vuejs.org/) is not installed.

## Further Reading

[vue-router - in-component-guards](https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-this-in-before-route-enter.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-this-in-before-route-enter.js)
