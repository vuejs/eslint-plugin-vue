# enforce self-closing style (vue/html-self-closing)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

In Vue.js template, we can use either two styles for elements which don't have their content.

1. `<YourComponent></YourComponent>`
2. `<YourComponent/>` (self-closing)

Self-closing is simple and shorter, but it's not supported in raw HTML.
This rule helps you to unify the self-closing style.

## Rule Details

This rule has options which specify self-closing style for each context.

```json
{
  "vue/html-self-closing": ["error", {
    "html": {
      "void": "never",
      "normal": "always",
      "component": "always"
    },
    "svg": "always",
    "math": "always"
  }]
}
```

- `html.void` (`"never"` by default) ... The style of well-known HTML void elements.
- `html.normal` (`"always"` by default) ... The style of well-known HTML elements except void elements.
- `html.component` (`"always"` by default) ... The style of Vue.js custom components.
- `svg`(`"always"` by default) .... The style of well-known SVG elements.
- `math`(`"always"` by default) .... The style of well-known MathML elements.

Every option can be set to one of the following values:

- `"always"` ... Require self-closing at elements which don't have their content.
- `"never"` ... Disallow self-closing.
- `"any"` ... Don't enforce self-closing style.

----

:-1: Examples of **incorrect** code for this rule:

```html
<div></div>
<img/>
<img></img>
<MyComponent/></MyComponent>
<svg><path d=""></path></svg>
```

:+1: Examples of **correct** code for this rule:

```html
<div/>
<img>
<MyComponent/>
<svg><path d=""/></svg>
```
