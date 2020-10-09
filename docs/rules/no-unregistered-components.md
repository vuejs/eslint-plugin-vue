---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-unregistered-components
description: disallow using components that are not registered inside templates
---
# vue/no-unregistered-components
> disallow using components that are not registered inside templates

## :book: Rule Details

This rule reports components that haven't been registered and are being used in the template.

::: warning Note
This rule cannot check globally registered components and components registered in mixins 
unless you add them as part of the ignored patterns. `component`, `suspense` and `teleport` 
are ignored by default.
:::

<eslint-code-block :rules="{'vue/no-unregistered-components': ['error']}">

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

<eslint-code-block :rules="{'vue/no-unregistered-components': ['error']}">

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
  "vue/no-unregistered-components": ["error", {
    "ignorePatterns": []
  }]
}
```

- `ignorePatterns` Suppresses all errors if component name matches one or more patterns.

### `ignorePatterns: ['custom(\\-\\w+)+']`

<eslint-code-block :rules="{'vue/no-unregistered-components': ['error', { 'ignorePatterns': ['custom(\\-\\w+)+'] }]}">

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

<eslint-code-block :rules="{'vue/no-unregistered-components': ['error', { 'ignorePatterns': ['custom(\\-\\w+)+'] }]}">

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

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-unregistered-components.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-unregistered-components.js)
