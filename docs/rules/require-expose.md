---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-expose
description: require declare public properties using `expose`
since: v7.14.0
---
# vue/require-expose

> require declare public properties using `expose`

## :book: Rule Details

This rule enforces the component to explicitly declare the exposed properties to the component using `expose`. You can use `expose` to control the internal properties of a component so that they cannot be referenced externally.

The `expose` API was officially introduced in Vue 3.2.

<eslint-code-block :rules="{'vue/require-expose': ['error']}">

```vue
<script>
/* ✓ GOOD */
export default {
  expose: ['increment'],
  data() {
    return { count: 0 }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/require-expose': ['error']}">

```vue
<script>
/* ✗ BAD */
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/require-expose': ['error']}">

```vue
<script>
/* ✓ GOOD */
import { ref } from 'vue'

export default {
  setup(props, { expose }) {
    const count = ref(0)

    function increment() {
      count.value++
    }
    // public
    expose({
      increment
    })
    // private
    return { count }
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/require-expose': ['error']}">

```vue
<script>
/* ✗ BAD */
import { ref } from 'vue'

export default {
  setup(props) {
    const count = ref(0)

    function increment() {
      count.value++
    }
    return { increment, count }
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Vue RFCs - 0042-expose-api](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0042-expose-api.md)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.14.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-expose.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-expose.js)
