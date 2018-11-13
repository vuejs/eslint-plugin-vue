# enforce `v-on` directive style (vue/v-on-style)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.


## :book: Rule Details

This rule enforces `v-on` directive style which you should use shorthand or long form.

<eslint-code-block :rules="{'vue/v-on-style': ['error']}">
```html
<template>
  <!-- ✓ GOOD -->
  <div @click="foo"/>

  <!-- ✗ BAD -->
  <div v-on:click="foo"/>
</template>
```
</eslint-code-block>

## :wrench: Options
Default is set to `shorthand`.

```json
{
  "vue/v-on-style": [2, "shorthand" | "longform"]
}
```

- `"shorthand"` (default) ... requires using shorthand.
- `"longform"` ... requires using long form.

### `"longform"`

<eslint-code-block :rules="{'vue/v-on-style': ['error', 'longform']}">
```html
<template>
  <!-- ✓ GOOD -->
  <div v-on:click="foo"/>

  <!-- ✗ BAD -->
  <div @click="foo"/>
</template>
```
</eslint-code-block>


## Related links

- [Style guide - Directive shorthands](https://vuejs.org/v2/style-guide/#Directive-shorthands-strongly-recommended)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/v-on-style.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/v-on-style.js)
