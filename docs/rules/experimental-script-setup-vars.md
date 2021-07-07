---
pageClass: rule-details
sidebarDepth: 0
title: vue/experimental-script-setup-vars
description: prevent variables defined in `<script setup>` to be marked as undefined
since: v7.0.0
---
# vue/experimental-script-setup-vars

> prevent variables defined in `<script setup>` to be marked as undefined

- :warning: This rule was **deprecated**.

:::warning
This rule is an experimental rule. It may be removed without notice.
:::

This rule will find variables defined in `<script setup="args">` and mark them as defined variables.

This rule only has an effect when the `no-undef` rule is enabled.

:::warning
`<script setup="args">` syntax was rejected by Vue's RFC. Check out the [new syntax](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md).
:::

## :book: Rule Details

Without this rule this code triggers warning:

<eslint-code-block :rules="{'no-undef': ['error'], 'vue/experimental-script-setup-vars': ['error']}">

```vue
<script setup="props, { emit }">
import { watchEffect } from 'vue'

watchEffect(() => console.log(props.msg))
emit('foo')
</script>
```

</eslint-code-block>

After turning on, `props` and `emit` are being marked as defined and `no-undef` rule doesn't report an issue.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/experimental-script-setup-vars.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/experimental-script-setup-vars.js)
