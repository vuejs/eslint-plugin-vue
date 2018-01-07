# enforce usage of `this` in template (vue/this-in-template)

- :gear: This rule is included in `"plugin:vue/recommended"`.

## :book: Rule Details

:-1: Examples of **incorrect** code for this rule:

```html
<a :href="this.url">
  {{ this.text }}
</a>
```

:+1: Examples of **correct** code for this rule:

```html
<a :href="url">
  {{ text }}
</a>
```

## :wrench: Options

Default is set to `never`.

```
'vue/this-in-template': [2, 'always'|'never']
```

### `"always"` - Always use `this` while accessing properties from Vue

:-1: Examples of **incorrect** code:

```html
<a :href="url">
  {{ text }}
</a>
```

:+1: Examples of **correct** code`:

```html
<a :href="this.url">
  {{ this.text }}
</a>
```

### `"never"` - Never use `this` keyword in expressions

:-1: Examples of **incorrect** code:

```html
<a :href="this.url">
  {{ this.text }}
</a>
```

:+1: Examples of **correct** code:

```html
<a :href="url">
  {{ text }}
</a>
```
