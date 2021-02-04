---
pageClass: rule-details
sidebarDepth: 0
title: vue/next-tick-style
description: enforce Promise or callback style in `nextTick`
since: v7.5.0
---
# vue/next-tick-style

> enforce Promise or callback style in `nextTick`

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces whether the callback version or Promise version (which was introduced in Vue v2.1.0) should be used in `Vue.nextTick` and `this.$nextTick`.

<eslint-code-block fix :rules="{'vue/next-tick-style': ['error']}">

```vue
<script>
import { nextTick as nt } from 'vue';

export default {
  async mounted() {
    /* ✓ GOOD */
    nt().then(() => callback());
    await nt(); callback();
    Vue.nextTick().then(() => callback());
    await Vue.nextTick(); callback();
    this.$nextTick().then(() => callback());
    await this.$nextTick(); callback();

    /* ✗ BAD */
    nt(() => callback());
    nt(callback);
    Vue.nextTick(() => callback());
    Vue.nextTick(callback);
    this.$nextTick(() => callback());
    this.$nextTick(callback);
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options
Default is set to `promise`.

```json
{
  "vue/next-tick-style": ["error", "promise" | "callback"]
}
```

- `"promise"` (default) ... requires using the promise version.
- `"callback"` ... requires using the callback version. Use this if you use a Vue version below v2.1.0.

### `"callback"`

<eslint-code-block fix :rules="{'vue/next-tick-style': ['error', 'callback']}">

```vue
<script>
import { nextTick as nt } from 'vue';

export default {
  async mounted() {
    /* ✓ GOOD */
    nt(() => callback());
    nt(callback);
    Vue.nextTick(() => callback());
    Vue.nextTick(callback);
    this.$nextTick(() => callback());
    this.$nextTick(callback);

    /* ✗ BAD */
    nt().then(() => callback());
    await nt(); callback();
    Vue.nextTick().then(() => callback());
    await Vue.nextTick(); callback();
    this.$nextTick().then(() => callback());
    await this.$nextTick(); callback();
  }
}
</script>
```

</eslint-code-block>

## :books: Further Reading

- [`Vue.nextTick` API in Vue 2](https://vuejs.org/v2/api/#Vue-nextTick)
- [`vm.$nextTick` API in Vue 2](https://vuejs.org/v2/api/#vm-nextTick)
- [Global API Treeshaking](https://v3.vuejs.org/guide/migration/global-api-treeshaking.html)
- [Global `nextTick` API in Vue 3](https://v3.vuejs.org/api/global-api.html#nexttick)
- [Instance `$nextTick` API in Vue 3](https://v3.vuejs.org/api/instance-methods.html#nexttick)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.5.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/next-tick-style.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/next-tick-style.js)
