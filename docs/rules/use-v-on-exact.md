# enforce usage of `exact` modifier on `v-on` (vue/use-v-on-exact)

This rule enforce usage of `exact` modifier on `v-on` when there is another `v-on` with modifier.

:+1: Examples of **correct** code for this rule:

```html
<template>
  <button @click="foo" :click="foo"></button>
  <button v-on:click.exact="foo" v-on:click.ctrl="foo"></button>
</template>
```

:-1: Examples of **incorrect** code for this rule:

```html
<template>
  <button v-on:click="foo" v-on:click.ctrl="foo"></button>
</template>
```

## Related rules

- [vue/v-on-style](./v-on-style.md)
- [vue/valid-v-on](./valid-v-on.md)
