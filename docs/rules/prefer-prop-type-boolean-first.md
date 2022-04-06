---
pageClass: rule-details
sidebarDepth: 0
title: vue/prefer-prop-type-boolean-first
description: enforce `Boolean` comes first in component prop types
since: v8.6.0
---
# vue/prefer-prop-type-boolean-first

> enforce `Boolean` comes first in component prop types

- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

When declaring types of a property in component, we can use array style to accept multiple types.

When using components in template,
we can use shorthand-style property if its value is `true`.

However, if a property allows `Boolean` or `String` and we use it with shorthand form in somewhere else,
different types order can introduce different behaviors:
If `Boolean` comes first, it will be `true`; if `String` comes first, it will be `""` (empty string).

See [this demo](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBNeUNvbXBvbmVudCBmcm9tICcuL015Q29tcG9uZW50LnZ1ZSdcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIFNob3J0aGFuZCBmb3JtOlxuICA8TXlDb21wb25lbnQgYm9vbCBib29sLW9yLXN0cmluZyBzdHJpbmctb3ItYm9vbCAvPlxuICBcbiAgTG9uZ2hhbmQgZm9ybTpcbiAgPE15Q29tcG9uZW50IDpib29sPVwidHJ1ZVwiIDpib29sLW9yLXN0cmluZz1cInRydWVcIiA6c3RyaW5nLW9yLWJvb2w9XCJ0cnVlXCIgLz5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIk15Q29tcG9uZW50LnZ1ZSI6IjxzY3JpcHQ+XG5leHBvcnQgZGVmYXVsdCB7XG4gIHByb3BzOiB7XG4gICAgYm9vbDogQm9vbGVhbixcbiAgICBib29sT3JTdHJpbmc6IFtCb29sZWFuLCBTdHJpbmddLFxuICAgIHN0cmluZ09yQm9vbDogW1N0cmluZywgQm9vbGVhbl0sXG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxwcmU+XG5ib29sOiB7e2Jvb2x9fSAoe3sgdHlwZW9mIGJvb2wgfX0pXG5ib29sT3JTdHJpbmc6IHt7Ym9vbE9yU3RyaW5nfX0gKHt7IHR5cGVvZiBib29sT3JTdHJpbmcgfX0pXG5zdHJpbmdPckJvb2w6IHt7c3RyaW5nT3JCb29sfX0gKHt7IHR5cGVvZiBzdHJpbmdPckJvb2wgfX0pXG4gIDwvcHJlPlxuPC90ZW1wbGF0ZT4ifQ==).

<eslint-code-block :rules="{'vue/prefer-prop-type-boolean-first': ['error']}">

```vue
<script>
export default {
  props: {
    // ✓ GOOD
    a: Boolean,
    b: String,
    c: [Boolean, String],
    d: {
      type: [Boolean, String]
    },

    // ✗ BAD
    e: [String, Boolean],
    f: {
      type: [String, Boolean]
    }
  }
}
</script>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/prefer-true-attribute-shorthand](./prefer-true-attribute-shorthand.md)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v8.6.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/prefer-prop-type-boolean-first.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/prefer-prop-type-boolean-first.js)
