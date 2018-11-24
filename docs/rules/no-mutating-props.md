# disallow mutation of component props (vue/no-mutating-props)

This rule reports mutation of component props.

## Rule Details

:-1: Examples of **incorrect** code for this rule:

```html
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

:+1: Examples of **correct** code for this rule:

```html
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

## :wrench: Options

Nothing.

## Related links

- [Vue - Prop Mutation - deprecated](https://vuejs.org/v2/guide/migration.html#Prop-Mutation-deprecated)
- [Style guide - Implicit parent-child communication](https://vuejs.org/v2/style-guide/#Implicit-parent-child-communication-use-with-caution)
