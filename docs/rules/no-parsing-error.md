---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-parsing-error
description: disallow parsing errors in `<template>`
---
# vue/no-parsing-error
> disallow parsing errors in `<template>`

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule reports syntax errors in `<template>`. For example:

- Syntax errors of scripts in directives.
- Syntax errors of scripts in mustaches.
- Syntax errors of HTML.
    - Invalid end tags.
    - Attributes in end tags.
    - ...
    - See also: [WHATWG HTML spec](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors)

## :book: Rule Details

This rule tries to parse directives/mustaches in `<template>` by the parser which parses `<script>`.
Then reports syntax errors if exist.

<eslint-code-block :rules="{'vue/no-parsing-error': ['error']}">

```vue
<template>
  <!-- ✗ BAD -->
  {{ . }}
  {{ foo bar }}
  <div :class="*abc*" / @click="def(">
    </span>
  </div id="ghi">
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-parsing-error": ["error", {
    "abrupt-closing-of-empty-comment": true,
    "absence-of-digits-in-numeric-character-reference": true,
    "cdata-in-html-content": true,
    "character-reference-outside-unicode-range": true,
    "control-character-in-input-stream": true,
    "control-character-reference": true,
    "eof-before-tag-name": true,
    "eof-in-cdata": true,
    "eof-in-comment": true,
    "eof-in-tag": true,
    "incorrectly-closed-comment": true,
    "incorrectly-opened-comment": true,
    "invalid-first-character-of-tag-name": true,
    "missing-attribute-value": true,
    "missing-end-tag-name": true,
    "missing-semicolon-after-character-reference": true,
    "missing-whitespace-between-attributes": true,
    "nested-comment": true,
    "noncharacter-character-reference": true,
    "noncharacter-in-input-stream": true,
    "null-character-reference": true,
    "surrogate-character-reference": true,
    "surrogate-in-input-stream": true,
    "unexpected-character-in-attribute-name": true,
    "unexpected-character-in-unquoted-attribute-value": true,
    "unexpected-equals-sign-before-attribute-name": true,
    "unexpected-null-character": true,
    "unexpected-question-mark-instead-of-tag-name": true,
    "unexpected-solidus-in-tag": true,
    "unknown-named-character-reference": true,
    "end-tag-with-attributes": true,
    "duplicate-attribute": true,
    "end-tag-with-trailing-solidus": true,
    "non-void-html-element-start-tag-with-trailing-solidus": false,
    "x-invalid-end-tag": true,
    "x-invalid-namespace": true
  }]
}
```

You can disable HTML syntax errors by options. Please see [WHATWG HTML spec](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors) to know the details of HTML syntax errors.
Only `non-void-html-element-start-tag-with-trailing-solidus` is disabled by default because Vue.js supports self-closing tags.

::: warning Note
This rule does not support all of those (E.g., it does not catch errors about DOCTYPE).
:::

The error codes which have `x-` prefix are original of this rule because errors in tree construction phase have not codified yet.

- `x-invalid-end-tag` enables the errors about the end tags of elements which have not opened.
- `x-invalid-namespace` enables the errors about invalid `xmlns` attributes. See also [step 10. of "create an element for a token"](https://html.spec.whatwg.org/multipage/parsing.html#create-an-element-for-the-token).

## :books: Further reading

- [WHATWG HTML spec](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-parsing-error.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-parsing-error.js)
