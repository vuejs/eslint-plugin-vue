# enforce consistent indentation in `<script>` (vue/script-indent)

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule is similar to core [indent](https://eslint.org/docs/rules/indent) rule, but it has an option for inside of `<script>` tag.

## Rule Details

This rule has some options.

```json
{
  "script-indent": ["error", TYPE, {
    "baseIndent": 0,
    "switchCase": 0,
    "ignores": []
  }]
}
```

- `TYPE` (`number | "tab"`) ... The type of indentation. Default is `2`. If this is a number, it's the number of spaces for one indent. If this is `"tab"`, it uses one tab for one indent.
- `baseIndent` (`integer`) ... The multiplier of indentation for top-level statements. Default is `0`.
- `switchCase` (`integer`) ... The multiplier of indentation for `case`/`default` clauses. Default is `0`.
- `ignores` (`string[]`) ... The selector to ignore nodes. The AST spec is [here](https://github.com/mysticatea/vue-eslint-parser/blob/master/docs/ast.md). You can use [esquery](https://github.com/estools/esquery#readme) to select nodes. Default is an empty array.

:+1: Examples of **correct** code for this rule:

```js
/*eslint vue/script-indent: "error"*/
<script>
let a = {
  foo: 1,
  bar: 2
}
let b = {
      foo: 1,
      bar: 2
    },
    c = {
      foo: 1,
      bar: 2
    }
const d = {
        foo: 1,
        bar: 2
      },
      e = {
        foo: 1,
        bar: 2
      }
</script>
```

:+1: Examples of **correct** code for this rule:

```js
/*eslint vue/script-indent: ["error", 2, {"baseIndent": 1}]*/
<script>
  let a = {
    foo: 1,
    bar: 2
  }
  let b = {
        foo: 1,
        bar: 2
      },
      c = {
        foo: 1,
        bar: 2
      }
  const d = {
          foo: 1,
          bar: 2
        },
        e = {
          foo: 1,
          bar: 2
        }
</script>
```

## Important note

This rule only checks `.vue` files and does not interfere with other `.js` files. Unfortunately the default `indent` rule when turned on will try to lint both, so in order to make them complementary you can use `overrides` setting and disable `indent` rule on `.vue` files:

```
"rules": {
  "vue/script-indent": ["error", 4, { "baseIndent": 1 }]
},
"overrides": [
  {
    "files": ["*.vue"],
    "rules": {
      "indent": "off"
    }
  }
]
```

## Related rules

- [indent](https://eslint.org/docs/rules/indent)
- [vue/html-indent](./html-indent.md)
