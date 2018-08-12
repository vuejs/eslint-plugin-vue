# disallow multiple spaces (vue/no-multi-spaces)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule aims at removing multiple spaces in tags, which are not used for indentation.

<eslint-code-block :rules="{'vue/no-multi-spaces': ['error']}">
```
<template>
  <!-- ✓ GOOD -->
  <div
    class="foo"
    :style="bar" />

  <!-- ✗ BAD -->
  <div     class="foo"
    :style =  "bar"         />
</template>
```
</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-multi-spaces.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-multi-spaces.js)
