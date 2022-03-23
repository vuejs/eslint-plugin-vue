# vue/no-restricted-html-elements

> Disallow specific html elements

## :book: Rule Details

This rule allows you to specify html elements that you don't want to use in your application.

<eslint-code-block fix :rules="{'vue/no-restricted-html-elements': ['error', 'marquee', 'button'] }">

```vue
<!-- ✓ GOOD -->
<p></p>
<input />
<br />

<!-- ✗ BAD -->
<button></button>
<marquee></marquee>
```

</eslint-code-block>

## :wrench: Options

This rule takes a list of strings, where each string is an html element name to be restricted:

```json
{
  "vue/no-restricted-html-elements": ["error", "button", "marquee"]
}
```

<eslint-code-block :rules="{'vue/no-restricted-block': ['error', 'button', 'marquee']}">

```vue
<!-- ✗ BAD -->
<button></button>
<marquee></marquee>
```

</eslint-code-block>

Alternatively, the rule also accepts objects.

```json
{
  "vue/no-restricted-html-elements": [
    "error",
    {
      "element": "button",
      "message": "Prefer use of our custom <AppButton /> component"
    },
    {
      "element": "marquee",
      "message": "Do not use deprecated HTML tags"
    }
  ]
}
```

The following properties can be specified for the object.

- `element` ... Specify the html element.
- `message` ... Specify an optional custom message.

### `{ "element": "marquee" }, { "element": "button" }`

<eslint-code-block :rules="{'vue/no-restricted-block': ['error', { element: 'marquee' }, { element: 'button' }]}">

```vue
<!-- ✗ BAD -->
<marquee></marquee>
<button></button>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-restricted-html-elements.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-restricted-html-elements.js)
