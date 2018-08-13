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

Nothing.
