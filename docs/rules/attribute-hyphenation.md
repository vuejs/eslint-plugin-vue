# enforce attribute naming style on custom components in template (vue/attribute-hyphenation)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :wrench: Options

Default casing is set to `always` with `['data-', 'aria-', 'slot-scope']` set to be ignored

```json
{
  "vue/attribute-hyphenation": [2, "always" | "never", {
    "ignore": ["custom-prop"]
  }]
}
```

### `["error", "always"]` - Use hyphenated name. 
It errors on upper case letters.

<eslint-code-block fix :rules="{'vue/attribute-hyphenation': ['error', 'always']}">
```
<template>
  <!-- ✔ GOOD -->
  <MyComponent my-prop="prop" />

  <!-- ✘ BAD -->
  <MyComponent myProp="prop" />
</template>
```
</eslint-code-block>

### `["error", "never"]` - Don't use hyphenated name. 
It errors on hyphens except `data-`, `aria-` and `slot-scope`.

<eslint-code-block fix :rules="{'vue/attribute-hyphenation': ['error', 'never']}">
```
<template>
  <!-- ✔ GOOD -->
  <MyComponent myProp="prop" />
  <MyComponent data-id="prop" />
  <MyComponent aria-role="button" />
  <MyComponent slot-scope="prop" />

  <!-- ✘ BAD -->
  <MyComponent my-prop="prop" />
</template>
```
</eslint-code-block>

### `["error", "never", { "ignore": ["custom-prop"] }]` - Don't use hyphenated name but allow custom attributes

<eslint-code-block fix :rules="{'vue/attribute-hyphenation': ['error', 'never', {'ignore': ['custom-prop']}]}">
```
<template>
  <!-- ✔ GOOD -->
  <MyComponent myProp="prop" />
  <MyComponent custom-prop="prop" />
  <MyComponent data-id="prop" />
  <MyComponent aria-role="button" />
  <MyComponent slot-scope="prop" />

  <!-- ✘ BAD -->
  <MyComponent my-prop="prop" />
</template>
```
</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/attribute-hyphenation.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/attribute-hyphenation.js)
