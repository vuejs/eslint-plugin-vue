---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-potential-component-option-typo
description: disallow a potential typo in your component property
---
# vue/no-potential-component-option-typo
> disallow a potential typo in your component property

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule reports components that haven't been used in the template.

<eslint-code-block :rules="{'vue/no-unused-components': ['error']}">

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

<eslint-code-block :rules="{'vue/no-unused-components': ['error']}">

```vue
<!-- ✗ BAD -->
<template>
  <div>
    <h2>Lorem ipsum</h2>
    <TheModal />
  </div>
</template>

<script>
  import TheButton from 'components/TheButton.vue'
  import TheModal from 'components/TheModal.vue'

  export default {
    components: {
      TheButton, // Unused component
      'the-modal': TheModal // Unused component
    }
  }
</script>
```

</eslint-code-block>

::: warning Note
Components registered under `PascalCase` or `camelCase` names have may be called however you like, except using `snake_case`. Otherwise, they will need to be called directly under the specified name.
:::

## :wrench: Options

```json
{
  "vue/no-unused-components": ["error", {
    "ignoreWhenBindingPresent": true
  }]
}
```

- `ignoreWhenBindingPresent` ... suppresses all errors if binding has been detected in the template
    default `true`

### `ignoreWhenBindingPresent: false`

<eslint-code-block :rules="{'vue/no-unused-components': ['error', { 'ignoreWhenBindingPresent': false }]}">

```vue
<!-- ✓ GOOD -->
<template>
  <div>
    <h2>Lorem ipsum</h2>
    <TheButton v-if="" />
    <TheSelect v-else-if="" />
    <TheInput v-else="" />
  </div>
</template>

<script>
  import TheButton from 'components/TheButton.vue'
  import TheSelect from 'components/TheSelect.vue'
  import TheInput from 'components/TheInput.vue'

  export default {
    components: {
      TheButton,
      TheSelect,
      TheInput,
    },
  }
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-unused-components': ['error', { 'ignoreWhenBindingPresent': false }]}">

```vue
<!-- ✗ BAD -->
<template>
  <div>
    <h2>Lorem ipsum</h2>
    <component :is="computedComponent" />
  </div>
</template>

<script>
  import TheButton from 'components/TheButton.vue'
  import TheSelect from 'components/TheSelect.vue'
  import TheInput from 'components/TheInput.vue'

  export default {
    components: {
      TheButton, // <- not used
      TheSelect, // <- not used
      TheInput, // <- not used
    },
    computed: {
      computedComponent() {
      }
    }
  }
</script>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-potential-component-option-typo.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-potential-component-option-typo.js)
