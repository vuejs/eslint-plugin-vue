---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-export-in-script-setup
description: disallow `export` in `<script setup>`
---
# vue/no-export-in-script-setup

> disallow `export` in `<script setup>`

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule warns ES module exports in `<script setup>`.

The previous version of `<script setup>` RFC used `export` to define variables used in templates, but the new `<script setup>` RFC has been updated to define without using `export`.
See [Vue RFCs - 0040-script-setup] for more details.

<eslint-code-block :rules="{'vue/no-export-in-script-setup': ['error']}">

```vue
<script setup>
/* ✓ GOOD */
let msg = 'Hello!'
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-export-in-script-setup': ['error']}">

```vue
<script setup>
/* ✗ BAD */
export let msg = 'Hello!'
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Vue RFCs - 0040-script-setup]

[Vue RFCs - 0040-script-setup]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-export-in-script-setup.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-export-in-script-setup.js)
