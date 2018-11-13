# enforce that a return statement is present in computed property (vue/return-in-computed-property)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule enforces that a `return` statement is present in `computed` properties.

<eslint-code-block :rules="{'vue/return-in-computed-property': ['error']}">
```vue
<script>
export default {
  computed: {
    /* ✓ GOOD */
    foo () {
      if (this.bar) {
        return this.baz
      } else {
        return this.baf
      }
    },
    bar: function () {
      return false
    },
    /* ✗ BAD */
    baz () {
      if (this.baf) {
        return this.baf
      }
    },
    baf: function () {}
  }
}
</script>
```
</eslint-code-block>

## :wrench: Options

This rule has an object option:
- `"treatUndefinedAsUnspecified"`: `true` (default) disallows implicitly returning undefined with a `return;` statement.

```json
{
  "vue/return-in-computed-property": [2, {
    "treatUndefinedAsUnspecified": true
  }]
}
```

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/return-in-computed-property.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/return-in-computed-property.js)
