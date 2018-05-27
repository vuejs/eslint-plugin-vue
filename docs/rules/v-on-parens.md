# enforce or forbid parentheses after method calls without arguments in `v-on` directives (vue/v-on-parens)

- :gear: This rule is included in `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

:-1: Example of **incorrect** code for this rule:

```html
<button v-on:click="closeModal()">
  Close
</button>
```

:+1: Example of **correct** code for this rule:

```html
<button v-on:click="closeModal">
  Close
</button>
```

## :wrench: Options

Default is set to `never`.

```
'vue/v-on-parens': [2, 'always'|'never']
```

### `"always"` - Always use parentheses in `v-on` directives

:-1: Example of **incorrect** code:

```html
<button v-on:click="closeModal">
  Close
</button>
```

:+1: Example of **correct** code:

```html
<button v-on:click="closeModal()">
  Close
</button>
```

### `"never"` - Never use parentheses in `v-on` directives for method calls without arguments

:-1: Example of **incorrect** code:

```html
<button v-on:click="closeModal()">
  Close
</button>
```

:+1: Example of **correct** code:

```html
<button v-on:click="closeModal">
  Close
</button>
```
