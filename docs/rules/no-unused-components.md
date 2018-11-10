# disallow registering components that are not used inside templates (vue/no-unused-components)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule reports components that haven't been used in the template.

## :book: Rule Details

:-1: Examples of **incorrect** code for this rule:

```html
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
      TheButton // Unused component
      'the-modal': TheModal // Unused component
    }
  }
</script>
```

Note that components registered under other than `PascalCase` name have to be called directly under the specified name, whereas if you register it using `PascalCase` you can call it however you like, except using `snake_case`.

:+1: Examples of **correct** code for this rule:

```html
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


:+1: Examples of **incorrect** code:

```json
{
    "vue/no-unused-components": ["error", {
        "ignoreWhenBindingPresent": false
    }]
}
```

```html
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
      computedComponent() { ... }
    }
  }
</script>
```

:+1: Examples of **correct** code:

```json
{
    "vue/no-unused-components": ["error", {
        "ignoreWhenBindingPresent": false
    }]
}
```

```html
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
