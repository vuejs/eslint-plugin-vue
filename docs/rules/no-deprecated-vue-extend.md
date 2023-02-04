---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-vue-extend
description: disallow using deprecated `Vue.extend` (in Vue.js 3.0.0+)
---
# vue/no-deprecated-vue-extend

> disallow using deprecated `Vue.extend` (in Vue.js 3.0.0+)

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.

## :book: Rule Details

This rule reports deprecated `Vue.extend` (removed in Vue.js v3.0.0+).

See [Migration Guide - Global API Application Instance](https://v3-migration.vuejs.org/breaking-changes/global-api.html#vue-extend-removed) for more details.

<eslint-code-block :rules="{'vue/no-deprecated-vue-extend': ['error']}">

```js
<!-- ✓ GOOD -->
const Profile = {/* */}

<!-- ✗ BAD -->
const Profile = Vue.extend({ /* */ })
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-deprecated-vue-extend': ['error']}">

```vue
<!-- ✓ GOOD -->
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  /* */
})
</script>

<!-- ✗ BAD -->
<script>
import Vue from 'vue'
export default Vue.extend({
  /* */
})
</script>
```

</eslint-code-block>

### :wrench: Options

Nothing.

## :books: Further Reading

- [Migration Guide - Global API Application Instance](https://v3-migration.vuejs.org/breaking-changes/global-api.html#vue-extend-removed)
- [Vue RFCs - 0009-global-api-change.md](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0009-global-api-change.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-vue-extend.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-vue-extend.js)
