# require or disallow the use of external script files (external-script) 

## :book: Rule Details

This rule requires or disallows the use of external script files.

:-1: Examples of **incorrect** code for this rule:

```html
<script src="myVueScript.js"></script>
```

:+1: Examples of **correct** code for this rule:

```html
<script>
  ...
  ... // all code inlined in the .vue file's script tag
  ...
</script>
```

## :wrench: Options

The rule is set to disallow (`"never"`) the external files by default.

```
'vue/external-script': [2, 'always'|'never']
```

### `"never"` - Disallow exteranl script files.

:+1: Examples of **correct** code`:

```html
<script>
...
</script>
```

:-1: Examples of **incorrect** code`:

```html
<script scr="myComponentCode.js"></script>
```
### `"always"` - Require the use of external script files.

:+1: Examples of **correct** code`:

```html
<script scr="myComponentCode.js"></script>
```

:-1: Examples of **incorrect** code`:

```html
<script>
...
</script>
```

