---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-undef-components
description: disallow use of undefined components in `<template>`
since: v8.4.0
---
# vue/no-undef-components

> disallow use of undefined components in `<template>`

This rule reports components that are used in the `<template>`, but that are not defined in the `<script setup>` or the Options API's `components` section.

Undefined components will be resolved from globally registered components. However, if you are not using global components, you can use this rule to prevent run-time errors.

::: warning Note
This rule cannot check globally registered components and components registered in mixins
unless you add them as part of the ignored patterns.
:::

<eslint-code-block :rules="{'vue/no-undef-components': ['error']}">

```vue
<script setup>
import Foo from './Foo.vue'
</script>

<template>
  <!-- ✓ GOOD -->
  <Foo />

  <!-- ✗ BAD -->
  <Bar />
</template>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-undef-components': ['error']}">

```vue
<!-- ✓ GOOD -->
<template>
  <div>
    <h2>Lorem ipsum</h2>
    <the-modal>
      <component is="TheInput" />
      <component :is="'TheDropdown'" />
      <TheButton>CTA</TheButton>
    </the-modal>
  </div>
</template>

<script>
import TheButton from 'components/TheButton.vue'
import TheModal from 'components/TheModal.vue'
import TheInput from 'components/TheInput.vue'
import TheDropdown from 'components/TheDropdown.vue'

export default {
  components: {
    TheButton,
    TheModal,
    TheInput,
    TheDropdown,
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-undef-components': ['error']}">

```vue
<!-- ✗ BAD -->
<template>
  <div>
    <h2>Lorem ipsum</h2>
    <TheModal />
  </div>
</template>

<script>
export default {
  components: {

  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-undef-components": ["error", {
    "ignorePatterns": []
  }]
}
```

- `ignorePatterns` Suppresses all errors if component name matches one or more patterns.

### `ignorePatterns: ['custom(\\-\\w+)+']`

<eslint-code-block :rules="{'vue/no-undef-components': ['error', { 'ignorePatterns': ['custom(\\-\\w+)+'] }]}">

```vue
<script setup>
</script>

<template>
  <!-- ✓ GOOD -->
  <CustomComponent />

  <!-- ✗ BAD -->
  <Bar />
</template>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-undef-components': ['error', { 'ignorePatterns': ['custom(\\-\\w+)+'] }]}">

```vue
<!-- ✓ GOOD -->
<template>
  <div>
    <h2>Lorem ipsum</h2>
    <CustomComponent />
  </div>
</template>

<script>
  export default {
    components: {

    },
  }
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-undef-components': ['error', { 'ignorePatterns': ['custom(\\-\\w+)+'] }]}">

```vue
<!-- ✗ BAD -->
<template>
  <div>
    <h2>Lorem ipsum</h2>
    <WarmButton />
  </div>
</template>

<script>
  export default {
    components: {

    },
  }
</script>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/no-undef-properties](./no-undef-properties.md)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v8.4.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-undef-components.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-undef-components.js)
