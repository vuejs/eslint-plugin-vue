# Enforce usage of `exact` modifier on `v-on` (vue/use-v-on-exact)

## :book: Rule Details

This rule enforce usage of `exact` modifier on `v-on` when there is another `v-on` with modifier.

<eslint-code-block :rules="{'vue/use-v-on-exact': ['error']}">
```html
<template>
  <!-- ✓ GOOD -->
  <button @click="foo" :click="foo"></button>
  <button v-on:click.exact="foo" v-on:click.ctrl="foo"></button>

  <!-- ✗ BAD -->
  <button v-on:click="foo" v-on:click.ctrl="foo"></button>
</template>
```
</eslint-code-block>

## :wrench: Options

```json
{
  "vue/use-v-on-exact": ["error"]
}
```

## Related rules

- [vue/v-on-style](./v-on-style.md)
- [vue/valid-v-on](./valid-v-on.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/use-v-on-exact.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/use-v-on-exact.js)
