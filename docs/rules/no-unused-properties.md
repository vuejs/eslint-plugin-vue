---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-unused-properties
description: disallow unused properties, data and computed properties
---
# vue/no-unused-properties
> disallow unused properties, data and computed properties

## :book: Rule Details

This rule disallows any unused properties, data and computed properties.

```vue
/* ✓ GOOD */

<template>
  <div>{{ count }}</div>
</template>

<script>
  export default {
    props: ['count']
  }
</script>
```

```vue
/* ✗ BAD (`count` property not used) */

<template>
  <div>{{ cnt }}</div>
</template>

<script>
  export default {
    props: ['count']
  }
</script>
```

```vue
/* ✓ GOOD */

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

```vue
/* ✓ BAD (`count` data not used) */

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

```vue
/* ✓ GOOD */

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

```vue
/* ✓ BAD (`reversedMessage` computed property not used) */

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

## :wrench: Options

None.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-unused-properties.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-unused-properties.js)
