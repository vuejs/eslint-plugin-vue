---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-unused-properties
description: disallow unused properties
---
# vue/no-unused-properties
> disallow unused properties

## :book: Rule Details

This rule is aimed at eliminating unused properties.

::: warning Note
This rule cannot be checked for use in other components (e.g. `mixins`, Property access via `$refs`) and use in places where the scope cannot be determined.
:::

<eslint-code-block :rules="{'vue/no-unused-properties': ['error']}">

```vue
<!-- ✓ GOOD -->
<template>
  <div>{{ count }}</div>
</template>
<script>
  export default {
    props: ['count']
  }
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-unused-properties': ['error']}">

```vue
<!-- ✗ BAD (`count` property not used) -->
<template>
  <div>{{ cnt }}</div>
</template>
<script>
  export default {
    props: ['count']
  }
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-unused-properties": ["error", {
    "groups": ["props"]
  }]
}
```

- `"groups"` (`string[]`) Array of groups to search for properties. Default is `["props"]`. The value of the array is some of the following strings:
  - `"props"`
  - `"data"`
  - `"computed"`
  - `"methods"`
  - `"setup"`

### `"groups": ["props", "data"]`

<eslint-code-block :rules="{'vue/no-unused-properties': ['error', {groups: ['props', 'data']}]}">

```vue
<!-- ✓ GOOD -->
<script>
  export default {
    data() {
      return {
        count: null
      }
    },
    created() {
      this.count = 2
    }
  }
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-unused-properties': ['error', {groups: ['props', 'data']}]}">

```vue
<!-- ✗ BAD (`count` data not used) -->
<script>
  export default {
    data() {
      return {
        count: null
      }
    },
    created() {
      this.cnt = 2
    }
  }
</script>
```

</eslint-code-block>

### `"groups": ["props", "computed"]`

<eslint-code-block :rules="{'vue/no-unused-properties': ['error', {groups: ['props', 'computed']}]}">

```vue
<!-- ✓ GOOD -->
<template>
  <p>{{ reversedMessage }}</p>
</template>
<script>
  export default {
    data() {
      return {
        message: 'Hello'
      }
    },
    computed: {
      reversedMessage() {
        return this.message.split('').reverse().join('')
      }
    }
  }
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-unused-properties': ['error', {groups: ['props', 'computed']}]}">

```vue
<!-- ✗ BAD (`reversedMessage` computed property not used) -->
<template>
  <p>{{ message }}</p>
</template>
<script>
  export default {
    data() {
      return {
        message: 'Hello'
      }
    },
    computed: {
      reversedMessage() {
        return this.message.split('').reverse().join('')
      }
    }
  }
</script>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-unused-properties.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-unused-properties.js)
