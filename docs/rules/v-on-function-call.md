---
pageClass: rule-details
sidebarDepth: 0
title: vue/v-on-function-call
description: enforce or forbid parentheses after method calls without arguments in `v-on` directives
---
# vue/v-on-function-call
> enforce or forbid parentheses after method calls without arguments in `v-on` directives

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

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
'vue/v-on-function-call': [2, 'always'|'never']
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

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/v-on-function-call.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/v-on-function-call.js)
