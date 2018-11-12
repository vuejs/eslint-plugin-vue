# require a line break before and after the contents of a singleline element (vue/singleline-html-element-content-newline)

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces a line break before and after the contents of a singleline element.


<eslint-code-block :rules="{'vue/singleline-html-element-content-newline': ['error']}">
```html
<template>
  <!-- ✓ GOOD -->
  <div attr>
    content
  </div>
  
  <tr attr>
    <td>
      {{ data1 }}
    </td>
    <td>
      {{ data2 }}
    </td>
  </tr>
  
  <div attr>
    <!-- comment -->
  </div>
  
  <!-- ✗ BAD -->
  <div attr>content</div>
  
  <tr attr><td>{{ data1 }}</td><td>{{ data2 }}</td></tr>
  
  <div attr><!-- comment --></div>
</template>
```
</eslint-code-block>

## :wrench: Options

```json
{
  "vue/singleline-html-element-content-newline": ["error", {
    "ignoreWhenNoAttributes": true,
    "ignores": ["pre", "textarea"]
  }]
}
```

- `ignoreWhenNoAttributes` ... allows having contents in one line, when given element has no attributes.
    default `true`
- `ignores` ... the configuration for element names to ignore line breaks style.  
    default `["pre", "textarea"]`


### `"ignoreWhenNoAttributes": true`

<eslint-code-block :rules="{'vue/singleline-html-element-content-newline': ['error', {'ignoreWhenNoAttributes': true}]}">
```html
<template>
  <!-- ✗ BAD -->
  <div attr>content</div>
  
  <tr attr><td>{{ data1 }}</td><td>{{ data2 }}</td></tr>
  
  <div attr><!-- comment --></div>
</template>
```
</eslint-code-block>

### `"ignoreWhenNoAttributes": false`

<eslint-code-block :rules="{'vue/singleline-html-element-content-newline': ['error', {'ignoreWhenNoAttributes': false}]}">
```html
<template>
  <!-- ✗ BAD -->
  <div>content</div>
  
  <tr><td>{{ data1 }}</td><td>{{ data2 }}</td></tr>

  <div><!-- comment --></div>
</template>
```
</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/singleline-html-element-content-newline.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/singleline-html-element-content-newline.js)
