# enforce valid template root (vue/valid-template-root)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every template root is valid.

## :book: Rule Details

This rule reports the template root in the following cases:

<eslint-code-block :rules="{'vue/valid-template-root': ['error']}">
```vue
<script>
  // The root is nothing
  Vue.component('example', {
    template: ''
  });

  // The root is text
  Vue.component('example', {
    template: 'abc'
  });

  // The root is multiple elements
  Vue.component('example', {
    template: `
      <div>hello</div>
      <div>hello</div>
    `
  });

  // The root element has `v-for` directives
  Vue.component('example', {
    template: '<div v-for="item in items"/>'
  });

  // The root element is `<template>` or `<slot>`
  Vue.component('example', {
    template: '<template>Hello</template>'
  });
</script>
```
</eslint-code-block>

Same rules apply to `.vue` templates.

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-template-root.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-template-root.js)
