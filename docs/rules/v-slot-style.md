---
pageClass: rule-details
sidebarDepth: 0
title: vue/v-slot-style
description: enforce `v-slot` directive style
---
# vue/v-slot-style
> enforce `v-slot` directive style

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces `v-slot` directive style which you should use shorthand or long form.

<eslint-code-block fix :rules="{'vue/v-slot-style': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <my-component v-slot="data">
    {{data}}
  </my-component>
  <my-component>
    <template #default>content</template>
    <template #one>content</template>
    <template #two>content</template>
  </my-component>

  <!-- ✗ BAD -->
  <my-component #default="data">
    {{data}}
  </my-component>
  <my-component>
    <template v-slot>content</template>
    <template v-slot:one>content</template>
    <template v-slot:two>content</template>
  </my-component>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/v-slot-style": ["error", {
    "atComponent": "shorthand" | "longform" | "v-slot",
    "default": "shorthand" | "longform" | "v-slot",
    "named": "shorthand" | "longform",
  }]
}
```

| Name | Type | Default Value | Description
|:-----|:-----|:--------------|:------------
| `atComponent` | `"shorthand"` \| `"longform"` \| `"v-slot"` | `"v-slot"` | The style for the default slot at custom components directly (E.g. `<my-component v-slot="">`).
| `default` | `"shorthand"` \| `"longform"` \| `"v-slot"` | `"shorthand"` | The style for the default slot at template wrappers (E.g. `<template #default="">`).
| `named` | `"shorthand"` \| `"longform"` | `"shorthand"` | The style for named slots (E.g. `<template #named="">`).

Each value means:

- `"shorthand"` ... use `#` shorthand. E.g. `#default`, `#named`, ...
- `"longform"` ... use `v-slot:` directive notation. E.g. `v-slot:default`, `v-slot:named`, ...
- `"v-slot"` ... use `v-slot` without that argument. This is shorter than `#default` shorthand.

And a string option is supported to be consistent to similar `vue/v-bind-style` and `vue/v-on-style`.

- `["error", "longform"]` is same as `["error", { atComponent: "longform", default: "longform", named: "longform" }]`.
- `["error", "shorthand"]` is same as `["error", { atComponent: "shorthand", default: "shorthand", named: "shorthand" }]`.

### `"longform"`

<eslint-code-block fix :rules="{'vue/v-slot-style': ['error', 'longform']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <my-component v-slot:default="data">
    {{data}}
  </my-component>
  <my-component>
    <template v-slot:default>content</template>
    <template v-slot:one>content</template>
    <template v-slot:two>content</template>
  </my-component>

  <!-- ✗ BAD -->
  <my-component v-slot="data">
    {{data}}
  </my-component>
  <my-component>
    <template #default>content</template>
    <template #one>content</template>
    <template #two>content</template>
  </my-component>
</template>
```

</eslint-code-block>

## :books: Further reading

- [Style guide - Directive shorthands](https://vuejs.org/v2/style-guide/#Directive-shorthands-strongly-recommended)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/v-slot-style.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/v-slot-style.js)
