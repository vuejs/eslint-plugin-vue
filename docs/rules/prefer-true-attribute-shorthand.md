---
pageClass: rule-details
sidebarDepth: 0
title: vue/prefer-true-attribute-shorthand
description: require shorthand form attribute when `v-bind` value is `true`.
---
# vue/prefer-true-attribute-shorthand

> require shorthand form attribute when `v-bind` value is `true`.

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

`v-bind` attribute with `true` value usually can be written in shorthand form. This can reduce verbosity.

<eslint-code-block :rules="{'vue/prefer-true-attribute-shorthand': ['error']}">

```vue
<template>
  <!-- ✗ BAD -->
  <MyComponent v-bind:show="true" />
  <MyComponent :show="true" />

  <!-- ✓ GOOD -->
  <MyComponent show />
  <MyComponent another-prop="true" />
</template>
```

</eslint-code-block>

However, those two representations are not always equivalent.
This case will be occurred if the definition of a prop include `String`:

```vue
<template>
  <pre>{{ prop }}</pre>
</template>

<script>
export default {
  name: 'MyComponent',
  props: {
    prop: [String, Boolean]
  }
}
</script>
```

```vue
<template>
  <MyComponent prop />
  <MyComponent :prop="true"/>
</template>
```

Those two calls will introduce different render result. See [this demo](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBNeUNvbXBvbmVudCBmcm9tICcuL015Q29tcG9uZW50LnZ1ZSdcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxNeUNvbXBvbmVudCBhIGIvPlxuICA8TXlDb21wb25lbnQgOmE9XCJ0cnVlXCIgOmI9XCJ0cnVlXCIvPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiTXlDb21wb25lbnQudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgcHJvcHM6IHtcbiAgICBhOiBCb29sZWFuLFxuICAgIGI6IFtTdHJpbmcsIEJvb2xlYW5dXG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxwcmU+XG5hOiB7e2F9fVxuYjoge3tifX1cbiAgPC9wcmU+XG48L3RlbXBsYXRlPiJ9).

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/prefer-true-attribute-shorthand.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/prefer-true-attribute-shorthand.js)
