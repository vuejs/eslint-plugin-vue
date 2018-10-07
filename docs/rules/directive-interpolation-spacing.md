# enforce unified spacing in mustache interpolations within directive expressions (vue/directive-interpolation-spacing)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule aims to enforce unified spacing in directive interpolations.

:-1: Examples of **incorrect** code for this rule:

```html
<div :property="{key:value}"></div>
<div :property="{    key:value    }"></div>
<div :property=" { key:value } "></div>
<div :property="{ [expression]:value,[expression]:value }"></div>
<div :property="[1,2,3]"></div>
```

:+1: Examples of **correct** code for this rule:

```html
<div :property="{ key: value }"></div>
<div :property="{ [expression]: value }"></div>
<div :property="{ [expression]: value, [expression]: value }"></div>
<div :property="[ 1, 2, 3 ]"></div>
```

## :wrench: Options

Default spacing is set to `always`

```
'vue/directive-interpolation-spacing': [2, 'always'|'never']
```

### `"always"` - Expect one space between expression and curly braces / brackets.

:-1: Examples of **incorrect** code for this rule:

```html
<div :class="{key:value,key:value}"></div>
<div :class="[1,2]"></div>
```

:+1: Examples of **correct** code for this rule:

```html
<div :class="{ key: value, key: value }"></div>
<div :class="[ 1, 2 ]"></div>
```

### `"never"` - Expect no spaces between expression and curly braces / brackets.

:-1: Examples of **incorrect** code for this rule:

```html
<div :class="{ key: value, key: value }"></div>
<div :class="[ 1, 2, 3 ]"></div>
```

:+1: Examples of **correct** code for this rule:

```html
<div :class="{key: value, key: value}"></div>
<div :class="[1, 2, 3]"></div>
```
