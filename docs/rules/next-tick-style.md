---
pageClass: rule-details
sidebarDepth: 0
title: vue/next-tick-style
description: enforce Promise or callback style in `nextTick`
since: v7.5.0
---

# vue/next-tick-style

> enforce Promise or callback style in `nextTick`

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix-problems) can automatically fix some of the problems reported by this rule.
- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

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

When `nextTick(() => { ... })` is the last statement of an `async` function and the callback is an arrow function without parameters, declarations, or `return` statements, the autofix replaces it with `await nextTick()` followed by the callback body. Elsewhere in an `async` function, `await` would also delay the code after the call, so the rule only suggests `await nextTick()` (when the callback can be moved) or `nextTick().then(() => { ... })`. Outside `async` functions, the autofix uses `nextTick().then(() => { ... })`.

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

- [`Vue.nextTick` API in Vue 2](https://v2.vuejs.org/v2/api/#Vue-nextTick)
- [`vm.$nextTick` API in Vue 2](https://v2.vuejs.org/v2/api/#vm-nextTick)
- [Global API Treeshaking](https://v3-migration.vuejs.org/breaking-changes/global-api-treeshaking.html)
- [Global `nextTick` API in Vue 3](https://vuejs.org/api/general.html#nexttick)
- [Instance `$nextTick` API in Vue 3](https://vuejs.org/api/component-instance.html#nexttick)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.5.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/next-tick-style.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/next-tick-style.test.ts)
