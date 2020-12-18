---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-mutating-props
description: disallow mutation of component props
---
# vue/no-mutating-props
> disallow mutation of component props

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule reports mutation of component props.

<eslint-code-block :rules="{'vue/no-mutating-props': ['error']}">

```vue
<!-- ✗ BAD -->
<template>
  <div>
    <input v-model="value" @click="openModal">
  </div>
</template>
<script>
  export default {
    props: {
      value: {
        type: String,
        required: true
      }
    },
    methods: {
      openModal() {
        this.value = 'test'
      }
    }
  }
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-mutating-props': ['error']}">

```vue
<!-- ✓ GOOD -->
<template>
  <div>
    <input :value="value" @input="$emit('input', $event.target.value)" @click="openModal">
  </div>
</template>
<script>
  export default {
    props: {
      value: {
        type: String,
        required: true
      }
    },
    methods: {
      openModal() {
        this.$emit('input', 'test')
      }
    }
  }
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-mutating-props': ['error']}">

```vue
<script>
  export default {
    setup (props) {
      // ✗ BAD
      props.value = 'test'
    }
  }
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Style guide - Implicit parent-child communication](https://v3.vuejs.org/style-guide/#implicit-parent-child-communication-use-with-caution)
- [Vue - Prop Mutation - deprecated](https://vuejs.org/v2/guide/migration.html#Prop-Mutation-deprecated)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-mutating-props.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-mutating-props.js)
