# disallow unused components (vue/no-unused-components)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule reports components that haven't been used in the template.

## :book: Rule Details

:-1: Examples of **incorrect** code for this rule:

```html
<template>
  <div>
    <h2>Lorem ipsum</h2>
  </div>
</template>

<script>
  import TheButton from 'components/TheButton.vue'

  export default {
    components: {
      TheButton // Unused component
    }
  }
</script>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
  <div>
    <h2>Lorem ipsum</h2>
    <TheButton>CTA</TheButton>
  </div>
</template>

<script>
  import TheButton from 'components/TheButton.vue'

  export default {
    components: {
      TheButton
    }
  }
</script>
```

## :wrench: Options

Nothing.
