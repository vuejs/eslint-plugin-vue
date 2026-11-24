---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-non-reactive-in-computed-properties
description: disallow non-reactive component instance properties in computed properties
---

# vue/no-non-reactive-in-computed-properties

> disallow non-reactive component instance properties in computed properties

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule reports reads of `this.$slots` and `this.$refs` in the getters of Options API computed properties.

A computed property is cached and only re-evaluated when one of its reactive dependencies changes. `$slots` and `$refs` are not reactive, so a computed property that reads them keeps returning the value from its last evaluation after the slots or refs change. Read `$slots` in the template or in a method called from it, and read `$refs` in lifecycle hooks, watchers or event handlers.

<eslint-code-block :rules="{'vue/no-non-reactive-in-computed-properties': ['error']}">

```vue
<script>
export default {
  computed: {
    /* ✓ GOOD */
    hasClass() {
      return 'class' in this.$attrs
    },

    /* ✗ BAD */
    hasContentSlot() {
      return !!this.$slots.content
    },
    inputWidth() {
      return this.$refs.input ? this.$refs.input.offsetWidth : 0
    }
  },
  methods: {
    /* ✓ GOOD */
    hasFooterSlot() {
      return !!this.$slots.footer
    }
  }
}
</script>
```

</eslint-code-block>

The rule also checks `const vm = this` aliases and `const { $slots } = this` destructuring. It does not check functions nested inside a getter, computed setters, or `computed()` in the Composition API.

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/no-async-in-computed-properties](./no-async-in-computed-properties.md)
- [vue/no-side-effects-in-computed-properties](./no-side-effects-in-computed-properties.md)

## :books: Further Reading

- [Guide - Computed Properties](https://vuejs.org/guide/essentials/computed.html)
- [API - Setup Context](https://vuejs.org/api/composition-api-setup.html#setup-context)
- [Vue 2 Guide - Accessing Child Component Instances & Child Elements](https://v2.vuejs.org/v2/guide/components-edge-cases.html#Accessing-Child-Component-Instances-amp-Child-Elements)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-non-reactive-in-computed-properties.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-non-reactive-in-computed-properties.test.ts)
