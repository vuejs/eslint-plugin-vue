---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-vue-config-keycodes
description: disallow using deprecated `Vue.config.keyCodes` (in Vue.js 3.0.0+)
---
# vue/no-deprecated-vue-config-keycodes
> disallow using deprecated `Vue.config.keyCodes` (in Vue.js 3.0.0+)

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.

## :book: Rule Details

This rule reports use of deprecated `Vue.config.keyCodes` (in Vue.js 3.0.0+)

<eslint-code-block filename="a.js" language="javascript" :rules="{'vue/no-deprecated-vue-config-keycodes': ['error']}">

```js
/* ✗ BAD */
Vue.config.keyCodes = {
  // ...
}
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/no-deprecated-v-on-number-modifiers]

[vue/no-deprecated-v-on-number-modifiers]: ./no-deprecated-v-on-number-modifiers.md

## :books: Further Reading

- [Vue RFCs - 0014-drop-keycode-support]
- [API - Global Config - keyCodes]

[Vue RFCs - 0014-drop-keycode-support]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0014-drop-keycode-support.md
[API - Global Config - keyCodes]: https://vuejs.org/v2/api/#keyCodes

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-vue-config-keycodes.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-vue-config-keycodes.js)
