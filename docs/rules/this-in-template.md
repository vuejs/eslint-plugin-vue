# enforce usage of `this` in template (vue/this-in-template)

- :gear: This rule is included in `"plugin:vue/recommended"`.

## :book: Rule Details

<eslint-code-block :rules="{'vue/this-in-template': ['error']}">
```vue
<template>
  <!-- ✓ GOOD -->
  <a :href="url">
    {{ text }}
  </a>
  
  <!-- ✗ BAD -->
  <a :href="this.url">
    {{ this.text }}
  </a>
</template>
```
</eslint-code-block>

## :wrench: Options

```json
{
  "vue/this-in-template": [2, "always" | "never"]
}
```
- `"always"` ... Always use `this` while accessing properties from Vue.
- `"never"` (default) ... Never use `this` keyword in expressions.

### `"always"`

<eslint-code-block :rules="{'vue/this-in-template': ['error', 'always']}">
```vue
<template>
  <!-- ✓ GOOD -->
  <a :href="this.url">
    {{ this.text }}
  </a>
  
  <!-- ✗ BAD -->
  <a :href="url">
    {{ text }}
  </a>
</template>
```
</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/this-in-template.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/this-in-template.js)
