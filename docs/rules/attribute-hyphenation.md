# enforce attribute naming style on custom components in template (vue/attribute-hyphenation)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :wrench: Options

Default casing is set to `always` with `['data-', 'aria-', 'slot-scope']` set to be ignored

```
'vue/attribute-hyphenation': [2, 'always'|'never', { 'ignore': ['custom-prop'] }]
```

### `[2, "always"]` - Use hyphenated name. (It errors on upper case letters.)

:+1: Examples of **correct** code`:

```html
<MyComponent my-prop="prop"/>
```

:-1: Examples of **incorrect** code`:

```html
<MyComponent myProp="prop"/>
```

### `[2, "never"]` - Don't use hyphenated name. (It errors on hyphens except `data-`, `aria-` and `slot-scope-`.)

:+1: Examples of **correct** code`:

```html
<MyComponent myProp="prop"/>
```

:-1: Examples of **incorrect** code`:

```html
<MyComponent my-prop="prop"/>
```

### `[2, "never", { 'ignore': ['custom-prop'] }]` - Don't use hyphenated name but allow custom attributes

:+1: Examples of **correct** code`:

```html
<MyComponent myProp="prop" custom-prop="foo" data-id="1"/>
```

:-1: Examples of **incorrect** code`:

```html
<MyComponent my-prop="prop" custom-prop="foo" data-id="1"/>
```
